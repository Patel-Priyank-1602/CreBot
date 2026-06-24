import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { api, setClerkTokenGetter } from '../lib/api';
import { cn } from '../lib/utils';
import { ArrowLeft, Copy, Check, Users, Trash2, UserPlus, Mail, Settings } from 'lucide-react';
import Card from '../components/common/Card';

export default function BotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [widgetKey, setWidgetKey] = useState('');
  const [copied, setCopied] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');
  const [addError, setAddError] = useState('');

  const [generatedCode, setGeneratedCode] = useState('');
  const [generatingCode, setGeneratingCode] = useState(false);
  const [inviteAccess, setInviteAccess] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    api.bots.get(id!).then(res => {
      setIsOwner(res.is_owner);
      setCanEdit(res.can_edit);
    }).catch(console.error);

    api.bots.getSnippet(id!).then(res => {
      setWidgetKey(res.widget_key);
    }).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (canEdit) {
      api.bots.getMembers(id!).then(res => setMembers(res)).catch(console.error);
    }
  }, [id, canEdit]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviteLoading(true);
    setAddSuccess('');
    setAddError('');
    try {
      await api.bots.addMember(id!, inviteEmail.trim());
      setAddSuccess(inviteEmail.trim());
      setInviteEmail('');
      api.bots.getMembers(id!).then(res => setMembers(res)).catch(console.error);
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setGeneratingCode(true);
    try {
      const res = await api.bots.generateInvite(id!, inviteAccess);
      setGeneratedCode(res.code);
    } catch (err: any) {
      alert('Failed to generate code: ' + err.message);
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.bots.removeMember(id!, memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err: any) {
      alert('Failed to remove member: ' + err.message);
    }
  };

  const handleDeleteBot = async () => {
    if (!confirm('Are you absolutely sure you want to delete this bot? This action cannot be undone.')) return;
    try {
      await api.bots.delete(id!);
      navigate('/dashboard/chatbots');
    } catch (err: any) {
      alert('Failed to delete bot: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--body-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/dashboard/chatbots/${id}`)}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Chatbot
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--btn-bg)] flex items-center justify-center text-[var(--btn-text)]">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Advanced Settings</h1>
            <p className="text-sm text-[var(--text-muted)]">Manage team members, access codes, and critical bot settings.</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border border-[var(--border-soft)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Team Access</h2>
                <p className="text-sm text-[var(--text-muted)]">Control who can view or edit this chatbot.</p>
              </div>
            </div>

            {canEdit ? (
              <div className="space-y-8">
                {/* Generate Access Code */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Generate Access Code</h3>
                      <p className="text-xs text-[var(--text-muted)]">Create a secure joining code to share with a team member.</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <select
                        value={inviteAccess}
                        onChange={(e) => setInviteAccess(e.target.value as 'view' | 'edit')}
                        className="bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none transition-colors"
                      >
                        <option value="view">View Access</option>
                        <option value="edit">Edit Access</option>
                      </select>
                      <button
                        onClick={handleGenerateCode}
                        disabled={generatingCode}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--text-primary)] text-[var(--bg-card)] hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {generatingCode ? 'Generating...' : 'Generate Code'}
                      </button>
                    </div>
                  </div>

                  {generatedCode && (
                    <div className="mt-4 p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-between gap-4">
                      <code className="text-sm font-mono text-[var(--text-primary)] break-all">{generatedCode}</code>
                      <button
                        onClick={() => { navigator.clipboard.writeText(generatedCode); alert('Copied access code!'); }}
                        className="shrink-0 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-card)] rounded-lg border border-[var(--border-default)] shadow-sm"
                        title="Copy Code"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  )}
                  {widgetKey && (
                    <p className="text-[11px] text-[var(--text-muted)] mt-3">
                      Note: Users can also join as viewers using the legacy Widget Key: <code className="font-mono text-[var(--text-secondary)]">{widgetKey}</code>
                    </p>
                  )}
                </div>

                {/* Member List */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Active Members</h3>
                  {members.length === 0 ? (
                    <div className="py-8 text-center bg-[var(--bg-input)] rounded-xl border border-[var(--border-soft)] border-dashed">
                      <Users size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
                      <p className="text-sm text-[var(--text-muted)]">No members have been added to this bot yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-[var(--border-soft)]">
                      <div className="overflow-x-auto">
                        <table className="w-full bg-[var(--bg-secondary)]">
                          <thead>
                            <tr className="border-b border-[var(--border-soft)] bg-[var(--bg-input)]">
                              <th className="text-left text-xs font-semibold text-[var(--text-muted)] px-5 py-3">Email Address</th>
                              <th className="text-left text-xs font-semibold text-[var(--text-muted)] px-5 py-3">Status</th>
                              <th className="text-left text-xs font-semibold text-[var(--text-muted)] px-5 py-3">Joined Date</th>
                              <th className="text-right text-xs font-semibold text-[var(--text-muted)] px-5 py-3">Management</th>
                            </tr>
                          </thead>
                          <tbody>
                            {members.map(member => (
                              <tr key={member.id} className="border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--hover-soft)] transition-colors">
                                <td className="px-5 py-4 text-sm text-[var(--text-primary)] font-medium">{member.member_email}</td>
                                <td className="px-5 py-4">
                                  <span className={cn(
                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                                    member.clerk_user_id
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  )}>
                                    {member.clerk_user_id ? 'Active User' : 'Pending Invite'}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-sm text-[var(--text-muted)]">
                                  {new Date(member.joined_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                                <td className="px-5 py-4 text-right">
                                  <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
                                  >
                                    <Trash2 size={14} /> Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-[var(--bg-input)] rounded-xl border border-[var(--border-soft)] border-dashed">
                <p className="text-sm text-[var(--text-muted)]">You do not have permission to manage members for this bot.</p>
              </div>
            )}
          </Card>

          {isOwner && (
            <Card className="p-6 border border-red-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-red-400 mb-1">Danger Zone</h2>
                  <p className="text-sm text-[var(--text-muted)] max-w-md">
                    Permanently delete this chatbot. This will instantly destroy all training data, historical chat logs, and revoke access for all members. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleDeleteBot}
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50 hover:border-red-500"
                >
                  <Trash2 size={16} /> Delete Chatbot
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
