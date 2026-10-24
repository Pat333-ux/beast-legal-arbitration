"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function ArbitrationDashboard() {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [respondent, setRespondent] = useState("");
  const [arbitrator, setArbitrator] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [disputes, setDisputes] = useState([]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please install MetaMask to access the Legal Arbitration Portal.");
    }
  };

  const handleFileDispute = async (e) => {
    e.preventDefault();
    if (!respondent || !arbitrator || !caseDetails) return;
    alert(`Filing dispute against: ${respondent}`);
    // Integration call to backend /api/arbitration/dispute/file
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">BEAST Legal Arbitration</h1>
            <p className="text-sm text-slate-400 mt-1">Decentralized Private Justice & Dispute Resolution</p>
          </div>
          <div>
            {account ? (
              <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-sm font-mono text-emerald-400">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {loading ? "Connecting..." : "Connect Arbitrator Wallet"}
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-sky-400">File New Dispute</h2>
            <form onSubmit={handleFileDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Respondent Wallet</label>
                <input
                  type="text"
                  value={respondent}
                  onChange={(e) => setRespondent(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Assigned Arbitrator Wallet</label>
                <input
                  type="text"
                  value={arbitrator}
                  onChange={(e) => setArbitrator(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Case Summary / Evidence Hash</label>
                <textarea
                  value={caseDetails}
                  onChange={(e) => setCaseDetails(e.target.value)}
                  placeholder="Enter case summary or IPFS hash of documentation..."
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition-colors text-sm"
              >
                Submit Dispute On-Chain
              </button>
            </form>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-sky-400">Active Arbitration Cases</h2>
            {disputes.length === 0 ? (
              <p className="text-slate-400 text-sm mt-8 text-center">No active disputes registered under this profile.</p>
            ) : (
              <div className="space-y-3">
                {/* Dispute records mapping */}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
