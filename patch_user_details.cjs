const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldDetails = `  if (selectedUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <h2 className="text-xl font-bold tracking-tight">User Details</h2>
        </div>
        <div className="bg-[#151A23] rounded-2xl border border-white/5 p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl border-2 border-blue-500/30">
              {(selectedUser.username || "U").substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {selectedUser.username || "Unknown"}
              </h3>
              <p className="text-gray-400 text-sm">ID: {selectedUser.uid}</p>
              <div className="flex space-x-2 mt-2">
                <span
                  className={\`px-2 py-0.5 rounded text-xs font-bold \${selectedUser.role === "vip" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}\`}
                >
                  {selectedUser.role === "vip" ? "VIP" : "Normal"}
                </span>
                <span
                  className={\`px-2 py-0.5 rounded text-xs font-bold \${selectedUser.status === "banned" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}\`}
                >
                  {selectedUser.status === "banned" ? "Banned" : "Active"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#0B0E14] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs mb-1">Coin Balance</p>
              <p className="text-xl font-black text-yellow-400">
                {selectedUser.vaBalance || 0}{" "}
                <span className="text-sm">VA</span>
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs mb-1">Total Earned</p>
              <p className="text-xl font-black text-green-400">
                {selectedUser.totalEarned || 0}{" "}
                <span className="text-sm">VA</span>
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs mb-1">Total Referrals</p>
              <p className="text-xl font-black text-blue-400">
                {selectedUser.referralCount || 0}
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs mb-1">Ads Watched</p>
              <p className="text-xl font-black text-purple-400">
                {selectedUser.dailyAdsWatched || 0}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                <span className="text-yellow-400">🪙</span>
                <span>Manage Coins</span>
              </h4>
              <div className="flex items-center space-x-3">
                <select
                  value={coinAction}
                  onChange={(e) => setCoinAction(e.target.value as any)}
                  className="bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none w-32"
                >
                  <option value="add">Add (+)</option>
                  <option value="remove">Remove (-)</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={coinAmount}
                  onChange={(e) =>
                    setCoinAmount(parseInt(e.target.value) || "")
                  }
                  className="flex-1 bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                />
                <button
                  onClick={handleUpdateCoins}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5">
              <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span>Account Actions</span>
              </h4>
              <button
                onClick={handleToggleBan}
                className={\`px-6 py-3 rounded-xl font-bold transition-colors w-full \${selectedUser.status === "banned" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}\`}
              >
                {selectedUser.status === "banned" ? "Unban User" : "Ban User"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }`;

const newDetails = `  if (selectedUser) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <h2 className="text-xl font-bold tracking-tight">User Details</h2>
        </div>
        <div className="bg-[#151A23] rounded-2xl border border-white/5 p-4 sm:p-6 shadow-lg overflow-hidden">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 shrink-0 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl border-2 border-blue-500/30 overflow-hidden">
              {selectedUser.photoUrl ? <img src={selectedUser.photoUrl} alt={selectedUser.username} className="w-full h-full object-cover"/> : (selectedUser.username || "U").substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <h3 className="font-bold text-white text-lg truncate">
                {selectedUser.username || "Unknown"}
              </h3>
              <p className="text-gray-400 text-sm truncate">ID: {selectedUser.uid}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span
                  className={\`px-2 py-0.5 rounded text-xs font-bold \${selectedUser.role === "vip" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}\`}
                >
                  {selectedUser.role === "vip" ? "VIP" : "Normal"}
                </span>
                <span
                  className={\`px-2 py-0.5 rounded text-xs font-bold \${selectedUser.status === "banned" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}\`}
                >
                  {selectedUser.status === "banned" ? "Banned" : "Active"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-[#0B0E14] rounded-xl p-3 sm:p-4 border border-white/5">
              <p className="text-gray-500 text-[10px] sm:text-xs mb-1">Coin Balance</p>
              <p className="text-lg sm:text-xl font-black text-yellow-400 truncate">
                {selectedUser.vaBalance || 0}{" "}
                <span className="text-xs sm:text-sm">VA</span>
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-3 sm:p-4 border border-white/5">
              <p className="text-gray-500 text-[10px] sm:text-xs mb-1">Total Earned</p>
              <p className="text-lg sm:text-xl font-black text-green-400 truncate">
                {selectedUser.totalEarned || 0}{" "}
                <span className="text-xs sm:text-sm">VA</span>
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-3 sm:p-4 border border-white/5">
              <p className="text-gray-500 text-[10px] sm:text-xs mb-1">Total Referrals</p>
              <p className="text-lg sm:text-xl font-black text-blue-400 truncate">
                {selectedUser.referralCount || 0}
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-3 sm:p-4 border border-white/5">
              <p className="text-gray-500 text-[10px] sm:text-xs mb-1">Ads Watched</p>
              <p className="text-lg sm:text-xl font-black text-purple-400 truncate">
                {selectedUser.dailyAdsWatched || 0}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                <span className="text-yellow-400">🪙</span>
                <span>Manage Coins</span>
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <select
                  value={coinAction}
                  onChange={(e) => setCoinAction(e.target.value as any)}
                  className="bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none w-full sm:w-32 shrink-0"
                >
                  <option value="add">Add (+)</option>
                  <option value="remove">Remove (-)</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={coinAmount}
                  onChange={(e) =>
                    setCoinAmount(parseInt(e.target.value) || "")
                  }
                  className="flex-1 w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none min-w-0"
                />
                <button
                  onClick={handleUpdateCoins}
                  className="px-6 py-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shrink-0 shadow-md"
                >
                  Update
                </button>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5">
              <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span>Account Actions</span>
              </h4>
              <button
                onClick={handleToggleBan}
                className={\`px-6 py-3.5 rounded-xl font-bold transition-colors w-full shadow-md \${selectedUser.status === "banned" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"}\`}
              >
                {selectedUser.status === "banned" ? "Unban User" : "Ban User"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }`;

code = code.replace(oldDetails, newDetails);
fs.writeFileSync('src/pages/Admin.tsx', code);
