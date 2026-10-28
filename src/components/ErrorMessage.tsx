export default function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <p>{message}</p>
      {onRetry && <button type="button" className="btn-outline mt-2" onClick={onRetry}>다시 시도</button>}
    </div>
  )
}
