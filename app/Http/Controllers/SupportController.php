<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SupportController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $query = Ticket::with(['user', 'messages'])->orderBy('updated_at', 'desc');

        if (!$user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $tickets = $query->get()->map(function($ticket) {
            return [
                'id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'category' => $ticket->category,
                'date' => $ticket->created_at->diffForHumans(),
                'user' => $ticket->user->name,
                'last_message' => $ticket->messages->last()?->message ?? 'No messages',
            ];
        });

        return Inertia::render('support/index', [
            'tickets' => $tickets,
            'isSuperAdmin' => $user->isSuperAdmin()
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $ticket = Ticket::with(['user', 'messages.user'])->findOrFail($id);

        if (!$user->isSuperAdmin() && $ticket->user_id !== $user->id) {
            abort(403);
        }

        return Inertia::render('support/show', [
            'ticket' => [
                'id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'category' => $ticket->category,
                'user' => $ticket->user->name,
                'date' => $ticket->created_at->toFormattedDateString(),
            ],
            'messages' => $ticket->messages->map(function($msg) {
                return [
                    'id' => $msg->id,
                    'message' => $msg->message,
                    'user_name' => $msg->user->name,
                    'is_me' => $msg->user_id === Auth::id(),
                    'is_admin' => $msg->user->isSuperAdmin(),
                    'date' => $msg->created_at->diffForHumans(),
                ];
            }),
            'isSuperAdmin' => $user->isSuperAdmin()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|string',
            'message' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'ticket_number' => 'TK-' . strtoupper(Str::random(8)),
            'user_id' => Auth::id(),
            'subject' => $request->subject,
            'category' => $request->category ?? 'general',
            'priority' => $request->priority ?? 'medium',
            'status' => 'open',
        ]);

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return redirect()->route('support.index')->with('success', 'Ticket created successfully.');
    }

    public function reply(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $ticket = Ticket::findOrFail($id);
        
        // Update ticket status to open if it was closed
        if ($ticket->status === 'closed') {
            $ticket->update(['status' => 'open']);
        }

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        // Touch the ticket to update its updated_at timestamp
        $ticket->touch();

        return back()->with('success', 'Reply sent.');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $ticket = Ticket::findOrFail($id);
        $ticket->update(['status' => $request->status]);

        return back()->with('success', 'Ticket status updated.');
    }

    public function updateMetadata(Request $request, $id)
    {
        if (!Auth::user()->isSuperAdmin()) {
            abort(403);
        }

        $request->validate([
            'category' => 'sometimes|required|string',
            'priority' => 'sometimes|required|string',
        ]);

        $ticket = Ticket::findOrFail($id);
        $ticket->update($request->only(['category', 'priority']));

        return back()->with('success', 'Ticket metadata updated.');
    }
}
