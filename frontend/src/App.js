import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://127.0.0.1:5000');

function App() {
  const [testcases, setTestcases] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [testcaseName, setTestcaseName] = useState('');
  const [module, setModule] = useState('');
  const [estimateTime, setEstimateTime] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('Pass');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/testcases')
      .then(response => setTestcases(response.data))
      .catch(error => console.error('Error fetching test cases:', error));

    socket.on('new_testcase', (data) => {
      setTestcases((prev) => {
        // Avoid adding duplicate entries from socket event
        if (prev.find(tc => tc.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });
    });

    socket.on('update', (data) => {
      setTestcases((prev) =>
        prev.map((tc) => (tc.id === data.id ? data : tc))
      );
    });

    return () => {
      socket.off('new_testcase');
      socket.off('update');
    };
  }, []);

  const handleAddTestcase = (event) => {
    event.preventDefault();
    const newTestcase = {
      testcase_name: testcaseName,
      module: module,
      estimate_time: parseInt(estimateTime, 10),
      priority: priority,
      status: status,
    };

    axios.post('http://127.0.0.1:5000/testcases', newTestcase)
      .then(response => {
        // Ensure the new test case is only added via socket event
        setTestcaseName('');
        setModule('');
        setEstimateTime('');
        setPriority('');
        setStatus('Pass');
      })
      .catch(error => console.error('Error adding test case:', error));
  };

  const handleEditTestcase = (id, name, mod, time, prio, stat) => {
    setEditingId(id);
    setTestcaseName(name);
    setModule(mod);
    setEstimateTime(time);
    setPriority(prio);
    setStatus(stat);
  };

  const handleUpdateTestcase = () => {
    const updatedTestcase = {
      testcase_name: testcaseName,
      module: module,
      estimate_time: parseInt(estimateTime, 10),
      priority: priority,
      status: status,
    };

    axios.put(`http://127.0.0.1:5000/testcases/${editingId}`, updatedTestcase)
      .then(response => {
        setEditingId(null);
        setTestcaseName('');
        setModule('');
        setEstimateTime('');
        setPriority('');
        setStatus('Pass');
      })
      .catch(error => console.error('Error updating test case:', error));
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Test Case Management</h1>
        <div class="search-container">
  <input type="text" id="search-bar" placeholder="Search...(Functionality not added)"/>
  <button type="button" id="search-button">Search</button>
</div>
        {editingId === null && (
          <div className="form-container">
            <form onSubmit={handleAddTestcase}>
              <input
                type="text"
                placeholder="Test Case Name"
                value={testcaseName}
                onChange={(e) => setTestcaseName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Estimate Time (minutes)"
                value={estimateTime}
                onChange={(e) => setEstimateTime(e.target.value)}
                required
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
              <button type="submit">Add Test Case</button>
            </form>
          </div>
        )}
                <div class="filter-container">
  <label for="filter-dropdown">Filter by:</label>
  <select id="filter-dropdown">
    <option value="">Select an option(Functionality not added)</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </select>
</div>
        <div className="table-header">
          <div>Test Case Name</div>
          <div>Module</div>
          <div>Estimate Time</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <ul>
          {testcases.map((tc) => (
            <li key={tc.id} className="table-row">
              {editingId === tc.id ? (
                <>
                  <div>
                    <input
                      type="text"
                      value={testcaseName}
                      onChange={(e) => setTestcaseName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={module}
                      onChange={(e) => setModule(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={estimateTime}
                      onChange={(e) => setEstimateTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      required
                    >
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                  </div>
                  <button type="button" onClick={handleUpdateTestcase}>
                    Update
                  </button>
                </>
              ) : (
                <>
                  <div>{tc.testcase_name}</div>
                  <div>{tc.module}</div>
                  <div>{tc.estimate_time}</div>
                  <div>{tc.priority}</div>
                  <div>{tc.status}</div>
                  <button
                    type="button"
                    onClick={() =>
                      handleEditTestcase(
                        tc.id,
                        tc.testcase_name,
                        tc.module,
                        tc.estimate_time,
                        tc.priority,
                        tc.status
                      )
                    }
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
