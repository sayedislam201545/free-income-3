const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const replacement = `
  if (selectedUser) {
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
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={coinAction}
                  onChange={(e) => setCoinAction(e.target.value as any)}
                  className="bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none w-full sm:w-32"
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
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
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
              <button
                onClick={handleToggleAdmin}
                className={\`px-6 py-3 rounded-xl font-bold transition-colors w-full mt-3 \${selectedUser.role === "admin" ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"}\`}
              >
                {selectedUser.role === "admin" ? "Remove Admin" : "Make Admin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Users Management</h2>
        <div className="flex-1 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl overflow-x-auto no-scrollbar">
        {["all", "normal", "vip"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={\`flex-1 py-2.5 rounded-lg font-bold text-sm capitalize transition-all whitespace-nowrap px-4 \${activeTab === tab ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
          >
            {tab} Users
          </button>
        ))}
      </div>

      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
        {["all", "active", "inactive", "banned"].map((status) => (
          <button
            key={status}
            onClick={() => setUserStatusFilter(status as any)}
            className={\`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors \${userStatusFilter === status ? "bg-white text-[#151A23]" : "bg-white/5 text-gray-400 hover:text-white"}\`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-[#151A23] rounded-2xl border border-white/5 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            No users found matching your criteria
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    {(user.username || "U").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {user.username || "Unknown"}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">ID: {user.uid}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400 font-bold text-sm">
                    {user.vaBalance || 0} VA
                  </span>
                  <div className="flex space-x-1">
                     <span className={\`w-2 h-2 rounded-full \${user.status === "banned" ? "bg-red-500" : (user.status === "inactive" ? "bg-gray-500" : "bg-green-500")}\`}></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
`;

const regex = /if \(selectedUser\) \{\s*\}\s*return \(\s*<div className="space-y-6">([\s\S]*?)<\/div>\s*\);\s*\}/;
code = code.replace(regex, replacement + "\n}");

fs.writeFileSync('src/pages/Admin.tsx', code);
