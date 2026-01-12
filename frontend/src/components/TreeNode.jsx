import { useState } from 'react'
import { IxButton } from '@siemens/ix-react'
import './TreeNode.css'

const TreeNode = ({
  node,
  level,
  index,
  onCreateCause,
  onUpdateCause,
  onDeleteCause,
  onMarkAsRootCause
}) => {
  const [showAddChild, setShowAddChild] = useState(false)
  const [showMarkRoot, setShowMarkRoot] = useState(false)
  const [newChildText, setNewChildText] = useState('')
  const [actionPlan, setActionPlan] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAddChild = async () => {
    if (!newChildText.trim()) return

    setSubmitting(true)
    try {
      await onCreateCause({
        cause_text: newChildText,
        parent_id: node.id
      })
      setNewChildText('')
      setShowAddChild(false)
    } catch (err) {
      console.error('Failed to add child cause:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkAsRoot = async () => {
    if (!actionPlan.trim()) {
      alert('Please provide an action plan')
      return
    }

    setSubmitting(true)
    try {
      await onMarkAsRootCause(node.id, actionPlan)
      setActionPlan('')
      setShowMarkRoot(false)
    } catch (err) {
      console.error('Failed to mark as root cause:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (node.children && node.children.length > 0) {
      if (!confirm('This will also delete all child causes. Continue?')) {
        return
      }
    }

    try {
      await onDeleteCause(node.id)
    } catch (err) {
      console.error('Failed to delete cause:', err)
    }
  }

  return (
    <div className="tree-node" style={{ marginLeft: level * 40 + 'px' }}>
      <div
        className={`node-content ${node.is_root_cause ? 'root-cause-node' : ''}`}
      >
        <div className="node-header">
          <span className="node-level">Why #{level + 1}</span>
          {node.is_root_cause && (
            <span className="root-cause-badge">✓ Root Cause</span>
          )}
        </div>

        <div className="node-text">
          {node.cause_text}
        </div>

        {node.is_root_cause && node.action_plan && (
          <div className="node-action-plan">
            <strong>Action Plan:</strong> {node.action_plan}
          </div>
        )}

        <div className="node-actions">
          {!node.is_root_cause && (
            <>
              <IxButton
                onClick={() => setShowAddChild(!showAddChild)}
                title="Ask 'Why?' - Add deeper cause"
              >
                + Add Why?
              </IxButton>

              <IxButton
                onClick={() => setShowMarkRoot(!showMarkRoot)}
                title="Mark as root cause and add action"
              >
                Mark as Root Cause
              </IxButton>
            </>
          )}

          <IxButton
            variant="danger-primary"
            onClick={handleDelete}
            title="Delete this cause"
          >
            Delete
          </IxButton>
        </div>

        {/* Add child form */}
        {showAddChild && (
          <div className="node-form">
            <div className="form-header">
              <strong>Why did "{node.cause_text}" happen?</strong>
            </div>
            <input
              type="text"
              value={newChildText}
              onChange={(e) => setNewChildText(e.target.value)}
              placeholder="Enter the deeper cause..."
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddChild()
              }}
            />
            <div className="form-actions">
              <IxButton
                onClick={handleAddChild}
                disabled={submitting || !newChildText.trim()}
              >
                Add Cause
              </IxButton>
              <IxButton
                variant="subtle-secondary"
                onClick={() => {
                  setShowAddChild(false)
                  setNewChildText('')
                }}
                disabled={submitting}
              >
                Cancel
              </IxButton>
            </div>
          </div>
        )}

        {/* Mark as root cause form */}
        {showMarkRoot && (
          <div className="node-form root-form">
            <div className="form-header">
              <strong>Define Corrective Action (D5)</strong>
            </div>
            <textarea
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder="What action will be taken to fix this root cause?"
              rows="3"
              autoFocus
            />
            <div className="form-actions">
              <IxButton
                onClick={handleMarkAsRoot}
                disabled={submitting || !actionPlan.trim()}
              >
                Save as Root Cause
              </IxButton>
              <IxButton
                variant="subtle-secondary"
                onClick={() => {
                  setShowMarkRoot(false)
                  setActionPlan('')
                }}
                disabled={submitting}
              >
                Cancel
              </IxButton>
            </div>
          </div>
        )}
      </div>

      {/* Render children recursively */}
      {node.children && node.children.length > 0 && (
        <div className="node-children">
          {node.children.map((child, idx) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              index={idx}
              onCreateCause={onCreateCause}
              onUpdateCause={onUpdateCause}
              onDeleteCause={onDeleteCause}
              onMarkAsRootCause={onMarkAsRootCause}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TreeNode
