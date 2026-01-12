import { useState, useEffect, useCallback } from 'react';
import { rootCausesApi } from '../services/api';

/**
 * Custom hook for managing root cause tree
 */
export const useRootCauses = (problemId) => {
  const [tree, setTree] = useState([]);
  const [rootCause, setRootCause] = useState(null);
  const [maxDepth, setMaxDepth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTree = useCallback(async () => {
    if (!problemId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await rootCausesApi.getTreeByProblemId(problemId);
      setTree(response.data.tree || []);
      setRootCause(response.data.root_cause || null);
      setMaxDepth(response.data.max_depth || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch root causes');
      console.error('Error fetching root causes:', err);
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const createCause = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await rootCausesApi.create({
        ...data,
        problem_id: problemId,
      });
      await fetchTree(); // Refresh tree
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create cause');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCause = async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await rootCausesApi.update(id, data);
      await fetchTree(); // Refresh tree
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cause');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCause = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await rootCausesApi.delete(id);
      await fetchTree(); // Refresh tree
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete cause');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRootCause = async (id, actionPlan) => {
    return updateCause(id, {
      is_root_cause: true,
      action_plan: actionPlan,
    });
  };

  return {
    tree,
    rootCause,
    maxDepth,
    loading,
    error,
    fetchTree,
    createCause,
    updateCause,
    deleteCause,
    markAsRootCause,
  };
};
