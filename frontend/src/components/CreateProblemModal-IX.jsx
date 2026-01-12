/**
 * Create Problem Modal using Siemens iX Modal Component
 * This is the iX version that should replace the basic modal
 */
import { useState } from 'react'
import { IxModal, IxModalHeader, IxModalContent, IxModalFooter, IxButton } from '@siemens/ix-react'
import './CreateProblemModal-IX.css'

const CreateProblemModalIX = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible_team: '',
    status: 'open'
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.responsible_team.trim()) {
      newErrors.responsible_team = 'Responsible team is required'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        title: '',
        description: '',
        responsible_team: '',
        status: 'open'
      })
      setErrors({})
    } catch (err) {
      console.error('Submission error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      setFormData({
        title: '',
        description: '',
        responsible_team: '',
        status: 'open'
      })
      setErrors({})
      onClose()
    }
  }

  return (
    <IxModal
      style={{ display: isOpen ? 'block' : 'none' }} // Fallback visibility
      onClose={handleClose}
      closeOnBackdropClick={!submitting}
    >
      <IxModalHeader>Create New Problem (D1-D2)</IxModalHeader>

      <IxModalContent>
        <form onSubmit={handleSubmit} className="ix-modal-form">
          <div className="ix-form-group">
            <label htmlFor="title">Problem Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="e.g., Machine A1 Unexpected Shutdown"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="ix-form-group">
            <label htmlFor="description">Problem Description (D2) *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              rows="4"
              placeholder="Detailed description of the problem..."
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="ix-form-group">
            <label htmlFor="responsible_team">Responsible Team (D1) *</label>
            <input
              type="text"
              id="responsible_team"
              name="responsible_team"
              value={formData.responsible_team}
              onChange={handleChange}
              className={errors.responsible_team ? 'error' : ''}
              placeholder="e.g., Maintenance Team"
            />
            {errors.responsible_team && <span className="error-text">{errors.responsible_team}</span>}
          </div>

          <div className="ix-form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </form>
      </IxModalContent>

      <IxModalFooter>
        <IxButton
          variant="subtle-secondary"
          onClick={handleClose}
          disabled={submitting}
        >
          Cancel
        </IxButton>
        <IxButton
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Creating...' : 'Create Problem'}
        </IxButton>
      </IxModalFooter>
    </IxModal>
  )
}

export default CreateProblemModalIX
