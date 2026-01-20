import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Send,
    ArrowLeft,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    Shield,
    MoreVertical,
    Lock,
    Unlock,
    Tag,
    Paperclip
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Ticket {
    id: number;
    ticket_number: string;
    subject: string;
    status: string;
    priority: string;
    category: string;
    user: string;
    date: string;
}

interface Message {
    id: number;
    message: string;
    user_name: string;
    is_me: boolean;
    is_admin: boolean;
    date: string;
}

interface Props {
    ticket: Ticket;
    messages: Message[];
    isSuperAdmin: boolean;
}

export default function SupportShow({ ticket, messages, isSuperAdmin }: Props) {
    const { t } = useTranslation();
    const [reply, setReply] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;

        router.post(route('support.reply', ticket.id), { message: reply }, {
            onSuccess: () => setReply(''),
            preserveScroll: true
        });
    };

    const updateStatus = (status: string) => {
        router.post(route('support.update-status', ticket.id), { status }, {
            preserveScroll: true
        });
    };

    const updateMetadata = (key: 'category' | 'priority', value: string) => {
        router.post(route('support.update-metadata', ticket.id), { [key]: value }, {
            preserveScroll: true
        });
    };

    return (
        <div className="p-8 pb-24 h-[calc(100vh-64px)] flex flex-col max-w-[1200px] mx-auto animate-in fade-in duration-500">
            <Head title={`${ticket.ticket_number} - ${ticket.subject}`} />

            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white border border-slate-100 shadow-sm"
                    onClick={() => router.visit(route('support.index'))}
                >
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-slate-400 text-sm tracking-widest">{ticket.ticket_number}</span>
                        <div className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600",
                            ticket.status === 'open' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        )}>
                            {ticket.status}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{ticket.subject}</h1>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl bg-white border border-slate-100">
                            <MoreVertical size={20} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl min-w-[200px] p-2">
                        {ticket.status === 'open' ? (
                            <DropdownMenuItem onClick={() => updateStatus('closed')} className="rounded-xl gap-2 font-bold text-slate-600 cursor-pointer">
                                <Lock size={16} />
                                {t('Close Ticket')}
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => updateStatus('open')} className="rounded-xl gap-2 font-bold text-slate-600 cursor-pointer">
                                <Unlock size={16} />
                                {t('Reopen Ticket')}
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="rounded-xl gap-2 font-bold text-rose-600 cursor-pointer">
                            <AlertCircle size={16} />
                            {t('Report Issue')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
                {/* Conversation Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar"
                    >
                        {messages.map((msg, idx) => (
                            <div key={msg.id} className={cn(
                                "flex flex-col max-w-[85%] md:max-w-[75%]",
                                msg.is_me ? "ml-auto items-end" : "items-start"
                            )}>
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    {!msg.is_me && (
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                            msg.is_admin ? "bg-slate-900 text-white" : "bg-indigo-100 text-indigo-600"
                                        )}>
                                            {msg.is_admin ? <Shield size={12} /> : msg.user_name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-xs font-bold text-slate-400">{msg.user_name}</span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">{msg.date}</span>
                                </div>

                                <div className={cn(
                                    "p-4 md:p-6 rounded-[24px] text-sm md:text-base leading-relaxed font-medium shadow-sm",
                                    msg.is_me
                                        ? "bg-slate-900 text-white rounded-tr-none"
                                        : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none"
                                )}>
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Area */}
                    <div className="p-4 md:p-8 pt-4 border-t border-slate-50 bg-white z-10">
                        {ticket.status === 'closed' ? (
                            <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 rounded-[24px] border border-slate-100 border-dashed text-center">
                                <Lock size={20} className="text-slate-400 mb-2" />
                                <p className="text-sm font-bold text-slate-500 mb-3">{t('This ticket is currently closed.')}</p>
                                <Button variant="outline" size="sm" className="rounded-xl font-bold h-9" onClick={() => updateStatus('open')}>
                                    {t('Reopen to Reply')}
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleReply} className="relative">
                                <Textarea
                                    placeholder={t('Type your message here...')}
                                    className="min-h-[120px] rounded-[24px] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/10 p-6 pr-24 font-medium transition-all resize-none"
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleReply(e);
                                        }
                                    }}
                                />
                                <div className="absolute right-4 bottom-4 flex items-center gap-2">
                                    <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-600">
                                        <Paperclip size={20} />
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 w-12 h-12"
                                        disabled={!reply.trim()}
                                    >
                                        <Send size={20} />
                                    </Button>
                                </div>
                            </form>
                        )}
                        <p className="mt-4 text-[10px] text-center font-bold text-slate-300 uppercase tracking-widest">
                            {t('Press Enter to send, Shift+Enter for new line')}
                        </p>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="w-full lg:w-80 space-y-6">
                    <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">{t('Ticket Details')}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t('Category')}</p>
                                {isSuperAdmin ? (
                                    <Select
                                        value={ticket.category}
                                        onValueChange={(v) => updateMetadata('category', v)}
                                    >
                                        <SelectTrigger className="h-9 rounded-xl border-slate-100 font-bold text-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl p-1">
                                            <SelectItem value="general">{t('General Support')}</SelectItem>
                                            <SelectItem value="billing">{t('Billing & Payments')}</SelectItem>
                                            <SelectItem value="technical">{t('Technical Issue')}</SelectItem>
                                            <SelectItem value="feature">{t('Feature Request')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        <Tag size={14} className="text-primary" />
                                        {ticket.category}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t('Priority')}</p>
                                {isSuperAdmin ? (
                                    <Select
                                        value={ticket.priority}
                                        onValueChange={(v) => updateMetadata('priority', v)}
                                    >
                                        <SelectTrigger className="h-9 rounded-xl border-slate-100 font-bold text-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl p-1">
                                            <SelectItem value="low">{t('Low')}</SelectItem>
                                            <SelectItem value="medium">{t('Medium')}</SelectItem>
                                            <SelectItem value="high">{t('High')}</SelectItem>
                                            <SelectItem value="critical">{t('Critical')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className={cn(
                                        "flex items-center gap-2 font-bold text-xs uppercase",
                                        ticket.priority === 'critical' ? "text-rose-600" :
                                            ticket.priority === 'high' ? "text-amber-600" :
                                                ticket.priority === 'medium' ? "text-indigo-600" : "text-slate-400"
                                    )}>
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            ticket.priority === 'critical' ? "bg-rose-500" :
                                                ticket.priority === 'high' ? "bg-amber-500" :
                                                    ticket.priority === 'medium' ? "bg-indigo-500" : "bg-slate-300"
                                        )}></div>
                                        {ticket.priority}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t('Created')}</p>
                                <p className="font-bold text-slate-700 text-sm">{ticket.date}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t('Requester')}</p>
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                                        {ticket.user?.charAt(0)}
                                    </div>
                                    {ticket.user}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-indigo-50/50 rounded-[32px] p-6 border border-indigo-100 border-dashed">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-500 text-white rounded-xl">
                                <Clock size={16} />
                            </div>
                            <h4 className="font-bold text-indigo-900 text-sm">{t('Support Hours')}</h4>
                        </div>
                        <p className="text-xs text-indigo-700/70 font-medium leading-relaxed">
                            {t('Our team is active Monday - Friday, 9AM to 6PM UTC. Critical tickets are monitored 24/7.')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

SupportShow.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;
