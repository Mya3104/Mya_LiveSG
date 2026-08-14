import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Neighborhood } from '../types';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNeighborhoods: Neighborhood[];
  onSelect: (n: Neighborhood) => void;
  onRemove: (id: string) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedNeighborhoods,
  onSelect,
  onRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Saved Shortlist</h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-sm text-slate-700 border border-slate-200">
              {savedNeighborhoods.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-sm hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {savedNeighborhoods.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Your shortlist is empty.</p>
              <p className="text-xs text-slate-500">
                Click &quot;Save&quot; on any neighbourhood to quickly access it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedNeighborhoods.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded border border-slate-200 hover:border-indigo-600 bg-white flex items-center justify-between group transition-all"
                >
                  <div
                    onClick={() => {
                      onSelect(n);
                      onClose();
                    }}
                    className="cursor-pointer flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {n.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {n.matchScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{n.tagline}</p>
                  </div>

                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => onRemove(n.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-sm hover:bg-slate-100 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
