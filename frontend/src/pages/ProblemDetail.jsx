import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IxButton, IxPill, IxChip } from '@siemens/ix-react'
import { useProblem } from '../hooks/useProblems'
import { useRootCauses } from '../hooks/useRootCauses'
import { problemsApi } from '../services/api'
import RootCauseTree from '../components/RootCauseTree'
import './ProblemDetail.css'

const ProblemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { problem, loading: problemLoading, refetch } = useProblem(id)
  const {
    tree,
    rootCause,
    maxDepth,
    loading: treeLoading,
    createCause,
    updateCause,
    deleteCause,
    markAsRootCause
  } = useRootCauses(id)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (problemLoading) {
    return <div className="loading-container">Loading problem...</div>
  }

  if (!problem) {
    return (
      <div className="error-container">
        <h2>Problem not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const className = status === 'open' ? 'pill-open' : 'pill-closed'
    const text = status === 'open' ? 'Open' : 'Closed'
    return (
      <IxPill className={className}>
        {text}
      </IxPill>
    )
  }

  const handleStatusToggle = async () => {
    const newStatus = problem.status === 'open' ? 'closed' : 'open'
    const confirmMessage = problem.status === 'open'
      ? 'Are you sure you want to close this problem?'
      : 'Are you sure you want to reopen this problem?'

    if (!window.confirm(confirmMessage)) {
      return
    }

    setStatusUpdating(true)
    try {
      await problemsApi.update(id, { status: newStatus })
      await refetch() // Refresh problem data
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update problem status. Please try again.')
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleDeleteProblem = async () => {
    const confirmMessage = `Are you sure you want to delete this problem?\n\n"${problem.title}"\n\nThis will also delete all associated root cause analysis data. This action cannot be undone.`

    if (!window.confirm(confirmMessage)) {
      return
    }

    setDeleting(true)
    try {
      await problemsApi.delete(id)
      navigate('/dashboard') // Go back to dashboard after deletion
    } catch (err) {
      console.error('Failed to delete problem:', err)
      alert('Failed to delete problem. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="problem-detail-container">
      {/* Navigation */}
      <IxButton onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </IxButton>

      {/* Problem Information Card (D1-D2) */}
      <div className="problem-info-card">
        <div className="card-header">
          <div>
            <h2>Problem #{problem.id}: {problem.title}</h2>
            <div className="problem-meta">
              {getStatusBadge(problem.status)}
              <span className="meta-item">
                <strong>Team:</strong> {problem.responsible_team}
              </span>
              <span className="meta-item">
                <strong>Created:</strong> {formatDate(problem.created_at)}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <IxButton
              onClick={handleStatusToggle}
              disabled={statusUpdating || deleting}
            >
              {statusUpdating ? 'Updating...' : problem.status === 'open' ? 'Close Problem' : 'Reopen Problem'}
            </IxButton>
            <IxButton
              onClick={handleDeleteProblem}
              disabled={statusUpdating || deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Problem'}
            </IxButton>
          </div>
        </div>

        <div className="card-body">
          <div className="info-section">
            <h3>Problem Description (D2)</h3>
            <p>{problem.description}</p>
          </div>
        </div>
      </div>

      {/* Root Cause Analysis Section (D4-D5) */}
      <div className="root-cause-section">
        <div className="section-header">
          <div>
            <h2>Root Cause Analysis (D4) - 5 Why Method</h2>
            <p>Click "Add Why?" to build the cause tree. Mark the root cause and define action (D5).</p>
          </div>
          <div className="tree-stats">
            <IxPill variant="info">
              Tree Depth: {maxDepth + 1}
            </IxPill>
            {rootCause && (
              <IxPill variant="success" icon="check">
                Root Cause Identified
              </IxPill>
            )}
          </div>
        </div>

        {treeLoading && <div className="loading-message">Loading tree...</div>}

        <RootCauseTree
          tree={tree}
          problemId={id}
          onCreateCause={createCause}
          onUpdateCause={updateCause}
          onDeleteCause={deleteCause}
          onMarkAsRootCause={markAsRootCause}
        />

        {rootCause && (
          <div className="root-cause-solution">
            <div className="solution-header">
              <h3>✓ Root Cause Identified & Corrective Action (D5)</h3>
            </div>
            <div className="solution-content">
              <div className="solution-item">
                <strong>Root Cause:</strong>
                <p>{rootCause.cause_text}</p>
              </div>
              <div className="solution-item">
                <strong>Corrective Action Plan:</strong>
                <p>{rootCause.action_plan}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProblemDetail
