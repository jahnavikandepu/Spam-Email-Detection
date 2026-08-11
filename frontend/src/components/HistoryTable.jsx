import React, { useState, useEffect } from 'react';
import { Search, Trash2, ShieldAlert, ShieldCheck, Calendar, Eye, X, Loader2 } from 'lucide-react';
import { fetchHistory, fetchHistoryById, clearAllHistory, deleteHistoryItem } from '../services/api';

export default function HistoryTable({ onSelectHistoryItem }) {
  const [historyList, setHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'spam' | 'not_spam'
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load history from backend API on mount or filter change
  const loadHistoryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await fetchHistory(searchTerm, filterType);
      
      // Map API record fields to UI table format
      const formattedRecords = records.map(r => ({
        id: r._id,
        _id: r._id,
        emailPreview: r.emailPreview || (r.emailContent ? r.emailContent.substring(0, 110) + '...' : ''),
        prediction: r.prediction,
        confidence: r.confidence,
        date: r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A',
        fullText: r.emailContent
      }));

      setHistoryList(formattedRecords);
    } catch (err) {
      console.warn('Failed to load history from backend API:', err.message);
      setError('Could not connect to backend API to retrieve history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistoryData();
    }, 300); // 300ms debounce for search input
    return () => clearTimeout(timer);
  }, [searchTerm, filterType]);

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all prediction history?')) return;
    try {
      await clearAllHistory();
      setHistoryList([]);
    } catch (err) {
      alert(`Error clearing history: ${err.message}`);
    }
  };

  const handleViewDetail = async (item) => {
    setSelectedItem(item);
    if (!item.fullText) {
      setIsModalLoading(true);
      try {
        const fullRecord = await fetchHistoryById(item._id);
        setSelectedItem({
          ...item,
          fullText: fullRecord.emailContent || item.emailPreview,
        });
      } catch (err) {
        console.error('Error fetching detail record:', err);
      } finally {
        setIsModalLoading(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Prediction History
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review past email scans, classification confidence scores, and safety logs.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all active:scale-95 self-start md:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history by content..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Segment Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                filterType === 'all' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('spam')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                filterType === 'spam' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Spam
            </button>
            <button
              onClick={() => setFilterType('not_spam')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                filterType === 'not_spam' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Not Spam
            </button>
          </div>

        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 px-4">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Loading prediction history from database...</p>
          </div>
        ) : historyList.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-slate-800">No predictions found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You have not analyzed any emails yet or no records match your criteria. Run a spam check on the Home page to see results here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Email Preview</th>
                  <th className="py-3.5 px-4">Prediction</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {historyList.map((item) => {
                  const isSpam = item.prediction === 'spam';
                  const confPct = (item.confidence * 100).toFixed(1);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Email Preview */}
                      <td className="py-4 px-4 sm:px-6 max-w-xs sm:max-w-md">
                        <p className="font-medium text-slate-900 line-clamp-2 leading-snug">
                          {item.emailPreview}
                        </p>
                      </td>

                      {/* Prediction Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isSpam 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isSpam ? <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>{isSpam ? 'Spam' : 'Not Spam'}</span>
                        </span>
                      </td>

                      {/* Confidence Meter */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold text-xs ${isSpam ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {confPct}%
                          </span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isSpam ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              style={{ width: `${confPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleViewDetail(item)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail Dialog */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <span className={`p-2 rounded-xl text-white ${selectedItem.prediction === 'spam' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                {selectedItem.prediction === 'spam' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedItem.prediction === 'spam' ? 'Spam Email Record' : 'Legitimate Email Record'}
                </h3>
                <p className="text-xs text-slate-500">Scanned on {selectedItem.date}</p>
              </div>
            </div>

            {isModalLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                <span className="text-xs text-slate-500">Fetching full email content...</span>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto mb-4">
                {selectedItem.fullText || selectedItem.emailPreview}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 font-semibold">
                Confidence: <span className="text-slate-900 font-extrabold">{(selectedItem.confidence * 100).toFixed(1)}%</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onSelectHistoryItem(selectedItem.fullText || selectedItem.emailPreview);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                >
                  Load in Analyzer
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
