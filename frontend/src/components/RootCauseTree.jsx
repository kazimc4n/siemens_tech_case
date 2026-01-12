import { useState } from 'react'
import { IxButton } from '@siemens/ix-react'
import TreeNode from './TreeNode'
import './RootCauseTree.css'

const RootCauseTree = ({
  tree,
  problemId,
  onCreateCause,
  onUpdateCause,
  onDeleteCause,
  onMarkAsRootCause
}) => {
  const [showAddRoot, setShowAddRoot] = useState(false)
  const [newRootText, setNewRootText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAddRootCause = async () => {
    if (!newRootText.trim()) return

    setSubmitting(true)
    try {
      await onCreateCause({
        cause_text: newRootText,
        parent_id: null
      })
      setNewRootText('')
      setShowAddRoot(false)
    } catch (err) {
      console.error('Failed to add root cause:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!tree || tree.length === 0) {
    return (
      <div className="empty-tree">
        <div className="empty-tree-content">
          <h3>Start Your 5 Why Analysis</h3>
          <p>Begin by asking "Why did the problem occur?" and add the first cause.</p>
          {!showAddRoot ? (
            <IxButton
              onClick={() => setShowAddRoot(true)}
            >
              + Add First Cause
            </IxButton>
          ) : (
            <div className="inline-add-form">
              <input
                type="text"
                value={newRootText}
                onChange={(e) => setNewRootText(e.target.value)}
                placeholder="Enter the first cause..."
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddRootCause()
                }}
              />
              <IxButton
                onClick={handleAddRootCause}
                disabled={submitting || !newRootText.trim()}
              >
                Add
              </IxButton>
              <IxButton
                variant="subtle-secondary"
                onClick={() => {
                  setShowAddRoot(false)
                  setNewRootText('')
                }}
                disabled={submitting}
              >
                Cancel
              </IxButton>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="root-cause-tree">
      <div className="tree-container">
        {tree.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            index={index}
            onCreateCause={onCreateCause}
            onUpdateCause={onUpdateCause}
            onDeleteCause={onDeleteCause}
            onMarkAsRootCause={onMarkAsRootCause}
          />
        ))}
      </div>

      {/* Add another root-level cause */}
      <div className="add-root-action">
        {!showAddRoot ? (
          <IxButton
            onClick={() => setShowAddRoot(true)}
          >
            + Add Another Branch
          </IxButton>
        ) : (
          <div className="inline-add-form">
            <input
              type="text"
              value={newRootText}
              onChange={(e) => setNewRootText(e.target.value)}
              placeholder="Enter another root cause..."
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddRootCause()
              }}
            />
            <IxButton
              onClick={handleAddRootCause}
              disabled={submitting || !newRootText.trim()}
            >
              Add
            </IxButton>
            <IxButton
              variant="subtle-secondary"
              onClick={() => {
                setShowAddRoot(false)
                setNewRootText('')
              }}
              disabled={submitting}
            >
              Cancel
            </IxButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default RootCauseTree
