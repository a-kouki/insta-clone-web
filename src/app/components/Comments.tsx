'use client';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from '@/styles/Comments.module.scss';
import { api } from '@/services/api';

// Interface da prop externa
interface CommentBoxProps {
  postId: string;
  token: string;
}

// Interface para o método que será chamado externamente
export type CommentBoxHandle = {
  focusTextarea: () => void;
};

// Componente com ref exportável
const CommentBox = forwardRef<CommentBoxHandle, CommentBoxProps>(({ postId, token }, ref) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Expor o método de foco para quem usar o ref
  useImperativeHandle(ref, () => ({
    focusTextarea: () => {
      textareaRef.current?.focus();
    }
  }));

  async function handlePublish() {
    if (!text.trim()) return;

    setLoading(true);
    try {
      await api.post(
        '/comment',
        { postId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText('');
    } catch (err) {
      console.error('Erro ao publicar comentário', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.publish_comment}>
      <span>🙂</span>
      <textarea
        ref={textareaRef}
        placeholder="Add a comment..."
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span
        className={styles.publish_button}
        onClick={handlePublish}
        style={{
          cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
          opacity: loading || !text.trim() ? 0.5 : 1
        }}
      >
        {loading ? '...' : 'Publish'}
      </span>
    </div>
  );
});

export default CommentBox;
