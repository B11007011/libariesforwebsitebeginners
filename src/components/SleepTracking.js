import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

function SleepTracking() {
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const calculateDuration = (sleep, wake) => {
    let sleepDate = new Date(`1970-01-01T${sleep}`);
    let wakeDate = new Date(`1970-01-01T${wake}`);
    
    // Handle overnight sleep periods
    if (wakeDate < sleepDate) {
      wakeDate = new Date(`1970-01-02T${wake}`);
    }
    
    const diff = wakeDate - sleepDate;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours} hours ${minutes} minutes`;
  };

  const handleSaveSleep = async () => {
    try {
      setError('');
      setSuccess(false);
      const auth = getAuth();
      const db = getFirestore();
      
      if (!auth.currentUser) {
        throw new Error('Please sign in to save your sleep schedule');
      }

      if (!sleepTime || !wakeTime) {
        throw new Error('Please enter both sleep and wake times');
      }

      const sleepData = {
        userId: auth.currentUser.uid,
        sleepTime,
        wakeTime,
        duration: calculateDuration(sleepTime, wakeTime),
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'sleepSchedules'), sleepData);
      
      setSuccess(true);
      // Clear form after successful save
      setSleepTime('');
      setWakeTime('');
    } catch (err) {
      setError(err.message);
      console.error('Sleep save error:', err);
    }
  };

  return (
    <div className="sleep-tracking p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Sleep Tracking</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Sleep schedule saved successfully!
        </div>
      )}
      
      <div className="space-y-4">
        <div className="time-input">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            When did you sleep?
            <input
              type="time"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
            />
          </label>
        </div>

        <div className="time-input">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            When did you wake up?
            <input
              type="time"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            />
          </label>
        </div>

        {sleepTime && wakeTime && (
          <div className="duration bg-blue-50 p-4 rounded-md text-blue-700">
            Sleep duration: {calculateDuration(sleepTime, wakeTime)}
          </div>
        )}

        <button 
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={handleSaveSleep}
          disabled={!sleepTime || !wakeTime}
        >
          SAVE SLEEP SCHEDULE
        </button>
      </div>
    </div>
  );
}

export default SleepTracking; 