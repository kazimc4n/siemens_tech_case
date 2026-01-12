/**
 * Problems List with Ag-Grid Integration
 * This component uses Ag-Grid for the table as required
 */
import { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './ProblemsList-AgGrid.css'

const ProblemsListAgGrid = ({ problems, loading, onRowClick }) => {
  // Column definitions for Ag-Grid
  const columnDefs = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      sortable: false,
      filter: false,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      sortable: false,
      filter: false,
      cellStyle: { fontWeight: '500', color: '#003e52' }
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        const desc = params.value || ''
        return desc.length > 100 ? desc.substring(0, 100) + '...' : desc
      }
    },
    {
      field: 'responsible_team',
      headerName: 'Responsible Team (D1)',
      width: 180,
      sortable: false,
      filter: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        const status = params.value
        const variant = status === 'open' ? 'warning' : 'success'
        const text = status === 'open' ? 'Open' : 'Closed'
        return (
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', lineHeight: '1' }}>
            <ix-pill class={status === 'open' ? 'pill-open' : 'pill-closed'}>
              {text}
            </ix-pill>
          </div>
        )
      }
    },
    {
      field: 'created_at',
      headerName: 'Created Date',
      width: 180,
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        return new Date(params.value).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
  ], [])

  // Default column definitions
  const defaultColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    resizable: true,
  }), [])

  // Row click handler
  const onRowClicked = (event) => {
    if (onRowClick) {
      onRowClick(event.data)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading problems...</p>
      </div>
    )
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="empty-state">
        <p>No problems found. Create your first problem to get started.</p>
      </div>
    )
  }

  return (
    <div className="ag-grid-container">
      <div
        className="ag-theme-alpine"
        style={{ height: '600px', width: '100%' }}
      >
        <AgGridReact
          rowData={problems}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onRowClicked={onRowClicked}
          rowSelection="single"
          animateRows={true}
          rowStyle={{ cursor: 'pointer' }}
        />
      </div>
      <div className="table-footer">
        <p>Total Problems: {problems.length}</p>
      </div>
    </div>
  )
}

export default ProblemsListAgGrid
