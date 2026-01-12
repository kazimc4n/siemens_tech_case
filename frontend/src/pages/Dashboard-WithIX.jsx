/**
 * Dashboard with Siemens iX Components
 * This version uses Ag-Grid and iX Modal as required
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IxButton } from '@siemens/ix-react'
import { useProblems } from '../hooks/useProblems'
import ProblemsListAgGrid from '../components/ProblemsList-AgGrid'
import CreateProblemModalIX from '../components/CreateProblemModal-IX'
import './Dashboard.css'

const DashboardWithIX = () => {
  const navigate = useNavigate()
  const { problems, loading, error, createProblem } = useProblems()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateProblem = async (data) => {
    try {
      await createProblem(data)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to create problem:', err)
    }
  }

  const handleRowClick = (problem) => {
    navigate(`/problems/${problem.id}`)
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Problem Dashboard (D1-D2)</h2>
          <p>Problem Definition and Team Assignment</p>
        </div>
        <IxButton onClick={() => setIsModalOpen(true)}>
          + New Problem
        </IxButton>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <ProblemsListAgGrid
        problems={problems}
        loading={loading}
        onRowClick={handleRowClick}
      />

      <CreateProblemModalIX
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProblem}
      />
    </div>
  )
}

export default DashboardWithIX
