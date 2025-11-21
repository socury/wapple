import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { WifiPoint } from '../../utils/types/wifi';
import type { WifiComment } from '../../utils/types/comment';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface SelectedWifiPanelProps {
  wifi: WifiPoint | null;
  distanceLabel?: string | null;
  onSaveWifi: () => void;
  onRemoveWifi?: () => void;
  onClearSelection?: () => void;
  isSaved?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  comments: WifiComment[];
  onAddComment: (content: string, parentId?: string) => void;
}

interface CommentNode extends WifiComment {
  replies: CommentNode[];
}

const buildCommentTree = (comments: WifiComment[]): CommentNode[] => {
  const nodes = new Map<string, CommentNode>();
  comments.forEach((comment) => {
    nodes.set(comment.id, { ...comment, replies: [] });
  });

  const roots: CommentNode[] = [];

  nodes.forEach((node) => {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortTree = (tree: CommentNode[]) => {
    tree.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    tree.forEach((node) => sortTree(node.replies));
  };

  sortTree(roots);
  return roots;
};

const formatTimestamp = (value: string) => {
  try {
    return new Date(value).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
};

export const SelectedWifiPanel: React.FC<SelectedWifiPanelProps> = ({
  wifi,
  distanceLabel,
  onSaveWifi,
  onRemoveWifi,
  onClearSelection,
  isSaved,
  showBackButton,
  onBack,
  comments,
  onAddComment,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  useEffect(() => {
    setNewComment('');
    setReplyDrafts({});
    setActiveReplyId(null);
  }, [wifi?.id]);

  if (!wifi) {
    return (
      <div className="border-t border-gray-200 pt-4">
        <div className="text-center text-gray-500 text-sm py-6">
          {t('selected.noSelection')}
        </div>
      </div>
    );
  }

  const commentsTree = useMemo(() => buildCommentTree(comments), [comments]);

  const handleSubmitComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setNewComment('');
  };

  const handleSubmitReply = (commentId: string) => {
    const trimmed = (replyDrafts[commentId] ?? '').trim();
    if (!trimmed) return;
    onAddComment(trimmed, commentId);
    setReplyDrafts((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  const renderComment = (commentNode: CommentNode, depth = 0): React.ReactNode => (
    <div key={commentNode.id} className={`mt-4 ${depth > 0 ? 'ml-4 border-l border-gray-200 pl-4' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">{commentNode.authorName ?? '익명'}</span>
            <span className="text-xs text-gray-400">{formatTimestamp(commentNode.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-line mt-1">{commentNode.content}</p>
        </div>
      </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-blue-600">
        <button
          type="button"
          className="hover:underline"
          onClick={() => setActiveReplyId((prev) => (prev === commentNode.id ? null : commentNode.id))}
        >
          {t('comments.reply')}
        </button>
      </div>
      {activeReplyId === commentNode.id && (
        <div className="mt-2">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder={t('comments.replyPlaceholder')}
            value={replyDrafts[commentNode.id] ?? ''}
            onChange={(e) =>
              setReplyDrafts((prev) => ({
                ...prev,
                [commentNode.id]: e.target.value,
              }))
            }
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setActiveReplyId(null)}
            >
              {t('comments.replyCancel')}
            </button>
            <button
              type="button"
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleSubmitReply(commentNode.id)}
            >
              {t('comments.replyPost')}
            </button>
          </div>
        </div>
      )}

      {commentNode.replies.map((child) => renderComment(child, depth + 1))}
    </div>
  );

  return (
    <div className="border-t border-gray-200 pt-4 space-y-5">
      {showBackButton && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="text-gray-600" />
          <span>{t('selected.backToSearch')}</span>
        </button>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-600">{wifi.name}</h3>
        <div className="text-xs flex items-center gap-2 text-gray-500">
          {distanceLabel && <span className="px-2 py-1 rounded-full bg-gray-100 font-semibold">{distanceLabel}</span>}
          {isSaved && <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">{t('selected.savedBadge')}</span>}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div>
          <span className="font-semibold">주소:</span>
          <p>{wifi.address}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded">{wifi.provider}</span>
          {wifi.installationType && (
            <span className="bg-gray-100 px-2 py-1 rounded">{wifi.installationType}</span>
          )}
          {wifi.serviceType && (
            <span className="bg-gray-100 px-2 py-1 rounded">{wifi.serviceType}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (!user) {
              if (typeof window !== 'undefined') window.alert(isSaved ? t('save.cancelLoginRequired') : t('save.loginRequired'));
              return;
            }
            if (isSaved) {
              onRemoveWifi?.();
            } else {
              onSaveWifi();
            }
          }}
          disabled={!user}
          className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg ${
            user ? (isSaved ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600') : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isSaved ? t('selected.saveButton.cancel') : t('selected.saveButton.save')}
        </button>
        {onClearSelection && (
            <button
              type="button"
              onClick={onClearSelection}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              {t('selected.clearSelection')}
            </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-700">{t('comments.title')}</h4>
          <p className="text-xs text-gray-500">{t('comments.subtitle')}</p>
        </div>
        <div>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder={t('comments.placeholder')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  if (typeof window !== 'undefined') window.alert(t('comments.loginAlert'));
                  return;
                }
                handleSubmitComment();
              }}
              className={`px-4 py-2 text-sm rounded-lg ${
                user ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!newComment.trim()}
            >
              {t('comments.submit')}
            </button>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto pr-2">
          {commentsTree.length === 0 ? (
            <p className="text-sm text-gray-500">{t('comments.noComments')}</p>
          ) : (
            commentsTree.map((commentNode) => renderComment(commentNode))
          )}
        </div>
      </div>
    </div>
  );
};
