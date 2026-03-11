import { Modal } from './Modal'

interface Props {
  open: boolean
  title: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmSheet({ open, title, message, onConfirm, onCancel }: Props) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="flex flex-col gap-4">
        {message && (
          <p className="text-[14px] text-text-sub leading-snug">{message}</p>
        )}
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary flex-1"
            style={{ background: '#E10600', borderColor: '#E10600' }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  )
}
