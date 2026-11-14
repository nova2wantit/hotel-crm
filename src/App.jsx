import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BellRing,
  BarChart3,
  Globe,
  Phone,
  Calendar,
  BedDouble,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Edit3,
  Trash2,
  X,
  RotateCcw,
  Hotel,
  ChevronRight,
  Send,
  Check
} from 'lucide-react';
const API = 'http://localhost:3000';

const fromServer = (r) => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  source: r.source,
  status: r.status,
  checkIn: r.check_in || '',
  checkOut: r.check_out || '',
  guests: r.guests,
  roomRequirement: r.room || '',
  followUpDate: r.follow_up || '',
  notes: r.notes || '',
  createdAt: (r.created_at || '').slice(0, 10),
});

const LEAD_SOURCES = [
  'WhatsApp',
  'Instagram',
  'Facebook',
  'Google Business Profile',
  'Website',
  'Phone Call',
];

const LEAD_STATUSES = [
  'New Enquiry',
  'Contacted',
  'Follow-up Required',
  'Booking Confirmed',
  'Cancelled / Lost',
];

const getRelativeDate = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

const INITIAL_LEADS = [
  {
    id: 'LD-1001',
    name: 'Rahul Sharma',
    phone: '9876543210',
    source: 'Instagram',
    checkIn: getRelativeDate(12),
    checkOut: getRelativeDate(14),
    guests: 3,
    roomRequirement: '1 Deluxe Room',
    status: 'New Enquiry',
    followUpDate: getRelativeDate(0),
    notes: 'Asked for early check-in and valley view.',
    createdAt: getRelativeDate(-1),
  },
  {
    id: 'LD-1002',
    name: 'Ananya Verma',
    phone: '9830112233',
    source: 'WhatsApp',
    checkIn: getRelativeDate(5),
    checkOut: getRelativeDate(8),
    guests: 2,
    roomRequirement: '1 Honeymoon Suite',
    status: 'Follow-up Required',
    followUpDate: getRelativeDate(-2),
    notes: 'Requested candlelight dinner package pricing.',
    createdAt: getRelativeDate(-4),
  },
  {
    id: 'LD-1003',
    name: 'Vikramaditya Sen',
    phone: '9123456780',
    source: 'Website',
    checkIn: getRelativeDate(20),
    checkOut: getRelativeDate(23),
    guests: 4,
    roomRequirement: '2 Executive Rooms',
    status: 'Booking Confirmed',
    followUpDate: '',
    notes: 'Advance payment of 50% received via UPI.',
    createdAt: getRelativeDate(-5),
  },
  {
    id: 'LD-1004',
    name: 'Priya Nair',
    phone: '9900887766',
    source: 'Google Business Profile',
    checkIn: getRelativeDate(7),
    checkOut: getRelativeDate(9),
    guests: 2,
    roomRequirement: '1 Premium Cottage',
    status: 'Contacted',
    followUpDate: getRelativeDate(0),
    notes: 'Shared tariff brochure on WhatsApp.',
    createdAt: getRelativeDate(-2),
  },
  {
    id: 'LD-1005',
    name: 'Rohan Malhotra',
    phone: '9811223344',
    source: 'Phone Call',
    checkIn: getRelativeDate(15),
    checkOut: getRelativeDate(18),
    guests: 6,
    roomRequirement: '1 Family Villa (3 BHK)',
    status: 'Follow-up Required',
    followUpDate: getRelativeDate(-1),
    notes: 'Travelling with senior citizens; needs ground floor.',
    createdAt: getRelativeDate(-3),
  },
  {
    id: 'LD-1006',
    name: 'Sneha Kulkarni',
    phone: '9765432109',
    source: 'Facebook',
    checkIn: getRelativeDate(25),
    checkOut: getRelativeDate(27),
    guests: 2,
    roomRequirement: '1 Deluxe Room',
    status: 'Booking Confirmed',
    followUpDate: '',
    notes: 'Airport pickup requested.',
    createdAt: getRelativeDate(-6),
  },
  {
    id: 'LD-1007',
    name: 'Arjun Chatterjee',
    phone: '9831098765',
    source: 'WhatsApp',
    checkIn: getRelativeDate(10),
    checkOut: getRelativeDate(12),
    guests: 3,
    roomRequirement: '1 Suite + Extra Bed',
    status: 'New Enquiry',
    followUpDate: getRelativeDate(1),
    notes: 'Enquired about weekend bonfire availability.',
    createdAt: getRelativeDate(0),
  },
  {
    id: 'LD-1008',
    name: 'Meera Joshi',
    phone: '9820011223',
    source: 'Instagram',
    checkIn: getRelativeDate(3),
    checkOut: getRelativeDate(5),
    guests: 2,
    roomRequirement: '1 Standard Room',
    status: 'Cancelled / Lost',
    followUpDate: '',
    notes: 'Postponed trip due to change in dates.',
    createdAt: getRelativeDate(-7),
  },
];

const STATUS_BADGE_STYLES = {
  'New Enquiry': 'bg-sky-50 text-sky-700 border-sky-200',
  'Contacted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Follow-up Required': 'bg-amber-50 text-amber-700 border-amber-200',
  'Booking Confirmed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Cancelled / Lost': 'bg-rose-50 text-rose-700 border-rose-200',
};

const SOURCE_BADGE_STYLES = {
  'WhatsApp': 'bg-green-50 text-green-700 border-green-200',
  'Instagram': 'bg-pink-50 text-pink-700 border-pink-200',
  'Facebook': 'bg-blue-50 text-blue-700 border-blue-200',
  'Google Business Profile': 'bg-teal-50 text-teal-700 border-teal-200',
  'Website': 'bg-purple-50 text-purple-700 border-purple-200',
  'Phone Call': 'bg-slate-100 text-slate-700 border-slate-200',
};

const SOURCE_BAR_COLORS = {
  'WhatsApp': 'bg-emerald-500',
  'Instagram': 'bg-pink-500',
  'Facebook': 'bg-blue-500',
  'Google Business Profile': 'bg-teal-500',
  'Website': 'bg-violet-500',
  'Phone Call': 'bg-slate-600',
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return 'Not set';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const buildWhatsAppLink = (lead) => {
  const cleanDigits = (lead.phone || '').replace(/\D/g, '');
  const formattedPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
  const firstName = (lead.name || 'Guest').trim().split(' ')[0];
  const stayInfo =
    lead.checkIn && lead.checkOut
      ? ` for your stay from ${formatDisplayDate(lead.checkIn)} to ${formatDisplayDate(lead.checkOut)}`
      : '';
  const message = `Hello ${firstName}, thank you for contacting Grand Crest Resort & Spa. We would be happy to assist you with your booking enquiry${stayInfo}.`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};

export default function App() {
 const [leads, setLeads] = useState([]);

  const [activePage, setActivePage] = useState('dashboard');
  const [isWebsiteView, setIsWebsiteView] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [editingLead, setEditingLead] = useState(null);

  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    source: 'Instagram',
    checkIn: getRelativeDate(7),
    checkOut: getRelativeDate(9),
    guests: 2,
    roomRequirement: '1 Deluxe Room',
    status: 'New Enquiry',
    followUpDate: getRelativeDate(1),
    notes: '',
  });

  const [websiteForm, setWebsiteForm] = useState({
    name: '',
    phone: '',
    checkIn: getRelativeDate(10),
    checkOut: getRelativeDate(12),
    guests: 2,
    message: '',
  });
  const [websiteSubmitted, setWebsiteSubmitted] = useState(false);

  useEffect(() => {
  fetch(`${API}/enquiries`)
    .then((res) => res.json())
    .then((rows) => setLeads(rows.map(fromServer)))
    .catch((err) => console.error('Could not load enquiries', err));
}, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const todayStr = getRelativeDate(0);

  const metrics = useMemo(() => {
    const total = leads.length;
    const newEnquiries = leads.filter((l) => l.status === 'New Enquiry').length;
    const confirmed = leads.filter((l) => l.status === 'Booking Confirmed').length;

    const activeFollowUps = leads.filter(
      (l) =>
        l.status !== 'Booking Confirmed' &&
        l.status !== 'Cancelled / Lost' &&
        (l.status === 'Follow-up Required' || Boolean(l.followUpDate))
    );

    const overdueFollowUps = leads.filter(
      (l) =>
        l.status !== 'Booking Confirmed' &&
        l.status !== 'Cancelled / Lost' &&
        l.followUpDate &&
        l.followUpDate < todayStr
    );

    const todayFollowUps = leads.filter(
      (l) =>
        l.status !== 'Booking Confirmed' &&
        l.status !== 'Cancelled / Lost' &&
        l.followUpDate &&
        l.followUpDate === todayStr
    );

    const upcomingFollowUps = leads.filter(
      (l) =>
        l.status !== 'Booking Confirmed' &&
        l.status !== 'Cancelled / Lost' &&
        l.followUpDate &&
        l.followUpDate > todayStr
    );

    return {
      total,
      newEnquiries,
      pendingFollowUps: activeFollowUps.length,
      confirmed,
      overdueFollowUps,
      todayFollowUps,
      upcomingFollowUps,
    };
  }, [leads, todayStr]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        (lead.roomRequirement || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [leads, searchQuery, sourceFilter, statusFilter]);

  const sourceStats = useMemo(() => {
    const counts = LEAD_SOURCES.map((source) => {
      const matching = leads.filter((l) => l.source === source);
      const confirmed = matching.filter((l) => l.status === 'Booking Confirmed').length;
      return {
        source,
        count: matching.length,
        confirmed,
      };
    });
    const maxCount = Math.max(...counts.map((c) => c.count), 1);
    return { counts, maxCount };
  }, [leads]);

  const handleStatusChange = (id, newStatus) => {
  fetch(`${API}/enquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Update failed');
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
      );
      showToast(`Status updated to "${newStatus}"`);
    })
    .catch(() => showToast('Could not update the status.'));
};
  const handleFollowUpDateChange = (id, newDate) => {
  fetch(`${API}/enquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ follow_up: newDate }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Update failed');
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, followUpDate: newDate } : lead))
      );
      showToast(
        newDate
          ? `Follow-up scheduled for ${formatDisplayDate(newDate)}`
          : 'Follow-up date cleared'
      );
    })
    .catch(() => showToast('Could not update the follow-up date.'));
  };
const handleAddManualLead = (e) => {
  e.preventDefault();
  if (!newLeadForm.name.trim() || !newLeadForm.phone.trim()) return;

  fetch(`${API}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: newLeadForm.name.trim(),
      phone: newLeadForm.phone.trim(),
      source: newLeadForm.source,
      status: newLeadForm.status,
      check_in: newLeadForm.checkIn,
      check_out: newLeadForm.checkOut,
      guests: Number(newLeadForm.guests) || 1,
      room: newLeadForm.roomRequirement,
      follow_up: newLeadForm.followUpDate,
      notes: newLeadForm.notes,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    })
    .then((saved) => {
      setLeads((prev) => [fromServer(saved), ...prev]);
      setNewLeadForm({
        name: '',
        phone: '',
        source: 'Instagram',
        checkIn: getRelativeDate(7),
        checkOut: getRelativeDate(9),
        guests: 2,
        roomRequirement: '1 Deluxe Room',
        status: 'New Enquiry',
        followUpDate: getRelativeDate(1),
        notes: '',
      });
      showToast(`Enquiry for ${saved.name} added to CRM!`);
      setActivePage('leads');
    })
    .catch(() => showToast('Could not save the enquiry.'));
};

   
 const handleWebsiteSubmit = (e) => {
  e.preventDefault();
  if (!websiteForm.name.trim() || !websiteForm.phone.trim()) return;

  const message = websiteForm.message.trim();

  fetch(`${API}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: websiteForm.name.trim(),
      phone: websiteForm.phone.trim(),
      source: 'Website',
      status: 'New Enquiry',
      check_in: websiteForm.checkIn,
      check_out: websiteForm.checkOut,
      guests: Number(websiteForm.guests) || 2,
      room: message || 'Standard Website Enquiry',
      follow_up: todayStr,
      notes: message || 'Submitted via public hotel booking page.',
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    })
    .then((saved) => {
      setLeads((prev) => [fromServer(saved), ...prev]);
      setWebsiteSubmitted(true);
      showToast(`New website enquiry from ${saved.name} synced to CRM!`);
    })
    .catch(() => showToast('Could not send your enquiry. Please try again.'));
};



  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingLead) return;

    fetch(`${API}/enquiries/${editingLead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingLead.name,
        phone: editingLead.phone,
        source: editingLead.source,
        status: editingLead.status,
        check_in: editingLead.checkIn,
        check_out: editingLead.checkOut,
        guests: Number(editingLead.guests) || 1,
        room: editingLead.roomRequirement,
        follow_up: editingLead.followUpDate,
        notes: editingLead.notes,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then((saved) => {
        setLeads((prev) => prev.map((l) => (l.id === saved.id ? fromServer(saved) : l)));
        setEditingLead(null);
        showToast('Customer enquiry updated.');
      })
      .catch(() => showToast('Could not update the enquiry.'));
  };

  const handleDeleteLead = (id) => {
  fetch(`${API}/enquiries/${id}`, { method: 'DELETE' })
    .then((res) => {
      if (!res.ok) throw new Error('Delete failed');
      setLeads((prev) => prev.filter((l) => l.id !== id));
      showToast('Enquiry removed.');
    })
    .catch(() => showToast('Could not delete the enquiry.'));
};

  const handleResetDemo = () => {
    setLeads(INITIAL_LEADS);
    localStorage.setItem('grand_crest_crm_leads_v1', JSON.stringify(INITIAL_LEADS));
    setSearchQuery('');
    setSourceFilter('All');
    setStatusFilter('All');
    showToast('Demo data reset to initial sample leads.');
  };

  if (isWebsiteView) {
    return (
      <div className="min-h-screen bg-stone-50 text-slate-800 font-sans">
        <div className="bg-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2 sticky top-0 z-50 shadow">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Public Hotel Website Preview</span>
            <span className="hidden md:inline text-slate-400">
              — Submissions sync automatically into the Hotel CRM
            </span>
          </div>
          <button
            onClick={() => {
              setIsWebsiteView(false);
              setWebsiteSubmitted(false);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Back to CRM Dashboard
          </button>
        </div>

        <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white py-14 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-medium tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Boutique Luxury Hospitality
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                Grand Crest Resort &amp; Spa
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Experience serene mountain views, private villas, and curated dining. Send us your
                dates and our reservations desk will reach out within 15 minutes.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Best Direct Rate Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Flexible Check-in
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complimentary Breakfast
                </span>
              </div>
            </div>

            <div className="w-full md:w-[420px] bg-white text-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
              {websiteSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Enquiry Received!</h2>
                  <p className="text-sm text-slate-600">
                    Thank you, <span className="font-semibold">{websiteForm.name}</span>. Your
                    request has been logged into our front-desk CRM system.
                  </p>
                  <div className="pt-3 flex flex-col gap-2.5">
                    <button
                      onClick={() => {
                        setIsWebsiteView(false);
                        setWebsiteSubmitted(false);
                        setActivePage('dashboard');
                      }}
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
                    >
                      View Lead in CRM Dashboard →
                    </button>
                    <button
                      onClick={() => {
                        setWebsiteSubmitted(false);
                        setWebsiteForm({
                          name: '',
                          phone: '',
                          checkIn: getRelativeDate(10),
                          checkOut: getRelativeDate(12),
                          guests: 2,
                          message: '',
                        });
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-xl text-xs transition cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Plan Your Stay</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the form below for instant tariff &amp; room availability.
                    </p>
                  </div>

                  <form onSubmit={handleWebsiteSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Kabir Kapoor"
                        value={websiteForm.name}
                        onChange={(e) => setWebsiteForm({ ...websiteForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g., 9876543210"
                          value={websiteForm.phone}
                          onChange={(e) => setWebsiteForm({ ...websiteForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Number of Guests
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          required
                          value={websiteForm.guests}
                          onChange={(e) =>
                            setWebsiteForm({ ...websiteForm, guests: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          required
                          value={websiteForm.checkIn}
                          onChange={(e) =>
                            setWebsiteForm({ ...websiteForm, checkIn: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          required
                          value={websiteForm.checkOut}
                          onChange={(e) =>
                            setWebsiteForm({ ...websiteForm, checkOut: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Room Preference / Special Requirement
                      </label>
                      <textarea
                        rows="3"
                        placeholder="e.g., 2 Deluxe Rooms with balcony, vegetarian meal preference..."
                        value={websiteForm.message}
                        onChange={(e) =>
                          setWebsiteForm({ ...websiteForm, message: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Send Booking Enquiry
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </header>

        <section className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Deluxe Valley Rooms',
              price: '₹4,500 / night',
              desc: 'King-sized bed, private balcony overlooking pine hills, and high-speed Wi-Fi.',
            },
            {
              title: 'Executive Family Suites',
              price: '₹7,200 / night',
              desc: 'Spacious living area, two bedrooms, and complimentary evening tea service.',
            },
            {
              title: 'Luxury Pool Villas',
              price: '₹11,500 / night',
              desc: 'Private heated plunge pool, dedicated butler, and curated dining experience.',
            },
          ].map((room) => (
            <div
              key={room.title}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm"
            >
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                {room.price}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{room.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{room.desc}</p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'All Leads', icon: Users, badge: leads.length },
    { id: 'add', label: 'Add Enquiry', icon: UserPlus },
    {
      id: 'followups',
      label: 'Follow-ups',
      icon: BellRing,
      badge: metrics.overdueFollowUps.length + metrics.todayFollowUps.length,
      alert: metrics.overdueFollowUps.length > 0,
    },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row font-sans">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <aside className="w-full lg:w-64 bg-slate-900 text-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between lg:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm tracking-tight">Grand Crest CRM</div>
                <div className="text-[11px] text-slate-400">Hospitality Lead Desk</div>
              </div>
            </div>

            <button
              onClick={() => setIsWebsiteView(true)}
              className="lg:hidden bg-amber-500 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              Website Form
            </button>
          </div>

          <div className="p-3 hidden lg:block">
            <button
              onClick={() => setIsWebsiteView(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold py-2.5 px-3.5 rounded-xl text-xs shadow transition flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Public Website Form
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <nav className="px-3 py-2 flex lg:flex-col gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.alert
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/70 rounded-xl p-3 text-xs space-y-1">
            <div className="text-slate-300 font-medium">Demo Controls</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Changes save automatically in your browser. Reset anytime for presentations.
            </p>
            <button
              onClick={handleResetDemo}
              className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {activePage === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Reservations Dashboard</h1>
                <p className="text-sm text-slate-500">
                  Overview of multi-channel hotel enquiries, follow-ups, and confirmed bookings.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsWebsiteView(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-teal-600" />
                  Open Website Form
                </button>
                <button
                  onClick={() => setActivePage('add')}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Enquiry
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Enquiries
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.total}</p>
                  <p className="text-xs text-slate-500 mt-1">Across all 6 lead sources</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                    New Enquiries
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.newEnquiries}</p>
                  <p className="text-xs text-slate-500 mt-1">Awaiting first response</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                    Pending Follow-ups
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1.5">
                    {metrics.pendingFollowUps}
                  </p>
                  <p className="text-xs text-rose-600 font-medium mt-1">
                    {metrics.overdueFollowUps.length} overdue · {metrics.todayFollowUps.length} due today
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <BellRing className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Confirmed Bookings
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1.5">{metrics.confirmed}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {metrics.total > 0
                      ? `${Math.round((metrics.confirmed / metrics.total) * 100)}% conversion rate`
                      : '0% conversion'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {(metrics.overdueFollowUps.length > 0 || metrics.todayFollowUps.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Overdue Follow-ups ({metrics.overdueFollowUps.length})
                    </div>
                    <button
                      onClick={() => setActivePage('followups')}
                      className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      View all
                    </button>
                  </div>
                  {metrics.overdueFollowUps.length === 0 ? (
                    <p className="text-xs text-slate-500">No overdue follow-ups. Great job!</p>
                  ) : (
                    <div className="space-y-2.5">
                      {metrics.overdueFollowUps.slice(0, 3).map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50/60 border border-rose-100"
                        >
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{lead.name}</div>
                            <div className="text-xs text-slate-600">
                              {lead.roomRequirement} · Due {formatDisplayDate(lead.followUpDate)}
                            </div>
                          </div>
                          <a
                            href={buildWhatsAppLink(lead)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                      <Clock className="w-4 h-4" />
                      To Contact Today ({metrics.todayFollowUps.length})
                    </div>
                    <button
                      onClick={() => setActivePage('followups')}
                      className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                    >
                      Manage reminders
                    </button>
                  </div>
                  {metrics.todayFollowUps.length === 0 ? (
                    <p className="text-xs text-slate-500">No follow-ups scheduled for today.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {metrics.todayFollowUps.slice(0, 3).map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100"
                        >
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{lead.name}</div>
                            <div className="text-xs text-slate-600">
                              {lead.source} · {lead.roomRequirement}
                            </div>
                          </div>
                          <a
                            href={buildWhatsAppLink(lead)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Recent Customer Enquiries</h2>
                  <p className="text-xs text-slate-500">
                    Latest leads received across WhatsApp, social media, calls, and website.
                  </p>
                </div>
                <button
                  onClick={() => setActivePage('leads')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                >
                  View All Leads <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Stay &amp; Room</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {leads.slice(0, 6).map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{lead.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              SOURCE_BADGE_STYLES[lead.source] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {lead.source}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800 text-xs sm:text-sm">
                            {lead.roomRequirement} ({lead.guests} Guests)
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {formatDisplayDate(lead.checkIn)} → {formatDisplayDate(lead.checkOut)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                              STATUS_BADGE_STYLES[lead.status]
                            }`}
                          >
                            {LEAD_STATUSES.map((st) => (
                              <option key={st} value={st} className="bg-white text-slate-800">
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={buildWhatsAppLink(lead)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activePage === 'leads' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">All Customer Leads</h1>
                <p className="text-sm text-slate-500">
                  Manage enquiries, update booking statuses, set follow-up dates, or message on WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setActivePage('add')}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Add New Lead
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by guest name, phone number, or room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Sources</option>
                    {LEAD_SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  {LEAD_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Guest Details</th>
                      <th className="py-3.5 px-4">Lead Source</th>
                      <th className="py-3.5 px-4">Stay Dates &amp; Room</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Follow-up Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-slate-500 text-sm">
                          No customer enquiries match your current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{lead.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{lead.phone}</div>
                            {lead.notes && (
                              <div className="text-[11px] text-slate-400 mt-1 max-w-[200px] truncate">
                                {lead.notes}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                SOURCE_BADGE_STYLES[lead.source]
                              }`}
                            >
                              {lead.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800 text-xs sm:text-sm">
                              {lead.roomRequirement}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {formatDisplayDate(lead.checkIn)} – {formatDisplayDate(lead.checkOut)} ·{' '}
                              {lead.guests} Guests
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                                STATUS_BADGE_STYLES[lead.status]
                              }`}
                            >
                              {LEAD_STATUSES.map((st) => (
                                <option key={st} value={st} className="bg-white text-slate-800">
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3.5 px-4">
                            <input
                              type="date"
                              value={lead.followUpDate || ''}
                              onChange={(e) => handleFollowUpDateChange(lead.id, e.target.value)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={buildWhatsAppLink(lead)}
                                target="_blank"
                                rel="noreferrer"
                                title="Send WhatsApp Message"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </a>
                              <button
                                onClick={() => setEditingLead({ ...lead })}
                                title="Edit Enquiry"
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                title="Delete Enquiry"
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activePage === 'add' && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Record New Booking Enquiry</h1>
              <p className="text-sm text-slate-500">
                Log enquiries received via phone call, WhatsApp, Instagram, Facebook, or Google.
              </p>
            </div>

            <form
              onSubmit={handleAddManualLead}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rahul Sharma"
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 9876543210"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Lead Source
                  </label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    {LEAD_SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Lead Status
                  </label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newLeadForm.checkIn}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newLeadForm.checkOut}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, checkOut: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={newLeadForm.guests}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, guests: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Room Requirement
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 1 Deluxe Room"
                    value={newLeadForm.roomRequirement}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, roomRequirement: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={newLeadForm.followUpDate}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, followUpDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Staff Notes / Special Requests
                </label>
                <textarea
                  rows="3"
                  placeholder="Any dietary requests, pickup notes, or negotiated rate details..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActivePage('dashboard')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-sm transition cursor-pointer"
                >
                  Save Customer Enquiry
                </button>
              </div>
            </form>
          </div>
        )}

        {activePage === 'followups' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Follow-up Reminders</h1>
              <p className="text-sm text-slate-500">
                Track overdue calls, today&apos;s scheduled follow-ups, and upcoming customer callbacks.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden">
                <div className="bg-rose-50 px-5 py-3.5 border-b border-rose-100 flex items-center justify-between">
                  <span className="font-bold text-rose-800 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Overdue
                  </span>
                  <span className="text-xs font-bold bg-rose-200/70 text-rose-900 px-2 py-0.5 rounded-full">
                    {metrics.overdueFollowUps.length}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {metrics.overdueFollowUps.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No overdue follow-ups.</p>
                  ) : (
                    metrics.overdueFollowUps.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                            <div className="text-xs text-slate-500">{lead.phone}</div>
                          </div>
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                            {formatDisplayDate(lead.followUpDate)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">{lead.roomRequirement}</div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <a
                            href={buildWhatsAppLink(lead)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                          <button
                            onClick={() => handleStatusChange(lead.id, 'Booking Confirmed')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 cursor-pointer"
                          >
                            Mark Confirmed
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="bg-amber-50 px-5 py-3.5 border-b border-amber-100 flex items-center justify-between">
                  <span className="font-bold text-amber-800 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Due Today
                  </span>
                  <span className="text-xs font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                    {metrics.todayFollowUps.length}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {metrics.todayFollowUps.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      No follow-ups due today.
                    </p>
                  ) : (
                    metrics.todayFollowUps.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/30 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                            <div className="text-xs text-slate-500">{lead.phone}</div>
                          </div>
                          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            Today
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">{lead.roomRequirement}</div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <a
                            href={buildWhatsAppLink(lead)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                          <button
                            onClick={() => handleStatusChange(lead.id, 'Contacted')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 cursor-pointer"
                          >
                            Mark Contacted
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-100 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Upcoming
                  </span>
                  <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                    {metrics.upcomingFollowUps.length}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {metrics.upcomingFollowUps.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      No upcoming follow-ups scheduled.
                    </p>
                  ) : (
                    metrics.upcomingFollowUps.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                            <div className="text-xs text-slate-500">{lead.phone}</div>
                          </div>
                          <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                            {formatDisplayDate(lead.followUpDate)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">{lead.roomRequirement}</div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <a
                            href={buildWhatsAppLink(lead)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                          <button
                            onClick={() => setEditingLead({ ...lead })}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100 cursor-pointer"
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'reports' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Lead Source Report</h1>
              <p className="text-sm text-slate-500">
                Breakdown of enquiries recorded by marketing channel to identify top-performing platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 text-base">Enquiries by Lead Source</h2>
                  <span className="text-xs text-slate-500">Total: {leads.length} enquiries</span>
                </div>

                <div className="space-y-4 pt-2">
                  {sourceStats.counts.map((item) => {
                    const widthPct = Math.round((item.count / sourceStats.maxCount) * 100);
                    return (
                      <div key={item.source} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-semibold text-slate-800">{item.source}</span>
                          <span className="text-slate-600 font-medium">
                            {item.count} {item.count === 1 ? 'enquiry' : 'enquiries'} (
                            {item.confirmed} confirmed)
                          </span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              SOURCE_BAR_COLORS[item.source] || 'bg-teal-600'
                            }`}
                            style={{ width: `${item.count === 0 ? 0 : Math.max(widthPct, 6)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="font-bold text-slate-900 text-base">Channel Summary</h2>
                <div className="divide-y divide-slate-100">
                  {sourceStats.counts.map((item) => {
                    const share =
                      leads.length > 0 ? Math.round((item.count / leads.length) * 100) : 0;
                    return (
                      <div
                        key={item.source}
                        className="py-3 flex items-center justify-between text-sm"
                      >
                        <div>
                          <div className="font-medium text-slate-800">{item.source}</div>
                          <div className="text-xs text-slate-400">{share}% of total leads</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{item.count}</div>
                          <div className="text-[11px] text-emerald-600 font-medium">
                            {item.confirmed} booked
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {editingLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Edit Customer Enquiry</h3>
              <button
                onClick={() => setEditingLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLead.name}
                    onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lead Source
                  </label>
                  <select
                    value={editingLead.source}
                    onChange={(e) => setEditingLead({ ...editingLead, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {LEAD_SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={editingLead.checkIn}
                    onChange={(e) => setEditingLead({ ...editingLead, checkIn: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={editingLead.checkOut}
                    onChange={(e) => setEditingLead({ ...editingLead, checkOut: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={editingLead.guests}
                    onChange={(e) => setEditingLead({ ...editingLead, guests: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Requirement
                  </label>
                  <input
                    type="text"
                    value={editingLead.roomRequirement}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, roomRequirement: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={editingLead.followUpDate || ''}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, followUpDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={editingLead.notes || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}