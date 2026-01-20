import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    LifeBuoy,
    Plus,
    Search,
    Filter,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ArrowLeft,
    Tag,
    X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Ticket {
    id: number;
    ticket_number: string;
    subject: string;
    status: string;
    priority: string;
    category: string;
    date: string;
    user: string;
    last_message: string;
}

interface Props {
    tickets: Ticket[];
    isSuperAdmin: boolean;
}

export default function SupportIndex({ tickets, isSuperAdmin }: Props) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: ''
    });

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('support.store'), formData, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setFormData({
                    subject: '',
                    category: 'general',
                    priority: 'medium',
                    message: ''
                });
            }
        });
    };

    return (
        <div className="p-8 pb-24 space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
            <Head title={t('Help Desk')} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <LifeBuoy className="text-primary" size={32} />
                        {t('Help Desk')}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {isSuperAdmin
                            ? t('Manage and respond to vendor support requests.')
                            : t('Need help? Submit a ticket and our team will get back to you.')}
                    </p>
                </div>

                {!isSuperAdmin && (
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl h-12 px-6 font-bold shadow-sm shadow-primary/20 gap-2">
                                <Plus size={20} />
                                {t('New Ticket')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-[24px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">{t('Submit New Ticket')}</DialogTitle>
                                    <DialogDescription className="font-medium text-slate-500">
                                        {t('Describe your issue and we will help you as soon as possible.')}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="font-bold">{t('Subject')}</Label>
                                        <Input
                                            id="subject"
                                            placeholder={t('Briefly describe the issue')}
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category" className="font-bold">{t('Category')}</Label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(v) => setFormData({ ...formData, category: v })}
                                            >
                                                <SelectTrigger className="rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">{t('General Support')}</SelectItem>
                                                    <SelectItem value="billing">{t('Billing & Payments')}</SelectItem>
                                                    <SelectItem value="technical">{t('Technical Issue')}</SelectItem>
                                                    <SelectItem value="feature">{t('Feature Request')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="priority" className="font-bold">{t('Priority')}</Label>
                                            <Select
                                                value={formData.priority}
                                                onValueChange={(v) => setFormData({ ...formData, priority: v })}
                                            >
                                                <SelectTrigger className="rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">{t('Low')}</SelectItem>
                                                    <SelectItem value="medium">{t('Medium')}</SelectItem>
                                                    <SelectItem value="high">{t('High')}</SelectItem>
                                                    <SelectItem value="critical">{t('Critical')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="font-bold">{t('Message')}</Label>
                                        <Textarea
                                            id="message"
                                            placeholder={t('Tell us more about what you need...')}
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            className="rounded-xl resize-none"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl font-bold">
                                        {t('Cancel')}
                                    </Button>
                                    <Button type="submit" className="rounded-xl font-bold px-8">
                                        {t('Submit Ticket')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder={t('Search by ticket #, subject...')}
                        className="pl-11 rounded-xl h-11 border-slate-100 focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <Button variant="outline" size="sm" className="rounded-full font-bold h-9">
                        <Filter size={16} className="mr-2" />
                        {t('Filters')}
                    </Button>
                    <div className="w-px h-4 bg-slate-100 mx-2 hidden md:block"></div>
                    <button className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold whitespace-nowrap">
                        {t('All Tickets')}
                    </button>
                    <button className="px-4 py-1.5 rounded-full hover:bg-slate-50 text-slate-500 text-xs font-bold whitespace-nowrap">
                        {t('Open')}
                    </button>
                    <button className="px-4 py-1.5 rounded-full hover:bg-slate-50 text-slate-500 text-xs font-bold whitespace-nowrap">
                        {t('Closed')}
                    </button>
                </div>
            </div>

            <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden bg-white">
                <CardContent className="p-0">
                    <DataTable
                        columns={[
                            {
                                key: 'ticket_number',
                                header: t('Ticket #'),
                                render: (item: Ticket) => (
                                    <span className="font-black text-slate-900">{item.ticket_number}</span>
                                )
                            },
                            {
                                key: 'subject',
                                header: t('Subject'),
                                render: (item: Ticket) => (
                                    <div className="flex flex-col min-w-[200px]">
                                        <span className="font-bold text-slate-900 truncate max-w-[300px]">{item.subject}</span>
                                        <span className="text-xs text-slate-400 font-medium truncate max-w-[300px]">{item.last_message}</span>
                                    </div>
                                )
                            },
                            {
                                key: 'user',
                                header: t('Vendor'),
                                render: (item: Ticket) => (
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            {item.user?.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-600 text-sm">{item.user}</span>
                                    </div>
                                )
                            },
                            {
                                key: 'status',
                                header: t('Status'),
                                render: (item: Ticket) => (
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit",
                                        item.status === 'open' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {item.status}
                                    </div>
                                )
                            },
                            {
                                key: 'priority',
                                header: t('Priority'),
                                render: (item: Ticket) => (
                                    <div className={cn(
                                        "flex items-center gap-1.5 font-bold text-xs uppercase",
                                        item.priority === 'critical' ? "text-rose-600" :
                                            item.priority === 'high' ? "text-amber-600" :
                                                item.priority === 'medium' ? "text-indigo-600" : "text-slate-400"
                                    )}>
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            item.priority === 'critical' ? "bg-rose-500 animate-pulse" :
                                                item.priority === 'high' ? "bg-amber-500" :
                                                    item.priority === 'medium' ? "bg-indigo-500" : "bg-slate-300"
                                        )}></div>
                                        {item.priority}
                                    </div>
                                )
                            },
                            {
                                key: 'date',
                                header: t('Updated'),
                                render: (item: Ticket) => (
                                    <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                                        <Clock size={12} />
                                        {item.date}
                                    </div>
                                )
                            },
                            {
                                key: 'actions',
                                header: '',
                                render: (item: Ticket) => (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-lg hover:bg-slate-50 text-slate-400 group"
                                        onClick={() => router.visit(route('support.show', item.id))}
                                    >
                                        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                )
                            },
                        ].filter(col => col.key !== 'user' || isSuperAdmin)}
                        data={filteredTickets}
                        keyExtractor={(item) => item.id.toString()}
                    />

                    {filteredTickets.length === 0 && (
                        <div className="py-24 px-6 text-center space-y-6">
                            <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mx-auto">
                                <MessageSquare size={40} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{t('No tickets found')}</h3>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                    {searchTerm
                                        ? t('No tickets match your current search criteria.')
                                        : t('Get started by creating your first support ticket.')}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

SupportIndex.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;
