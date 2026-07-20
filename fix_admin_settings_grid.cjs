const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldList = `        {[
          { title: "Coin Values", desc: "Manage coin values", key: "coin_values", icon: <Coins className="w-5 h-5 text-yellow-400" /> },
          { title: "Ad & Rewards", desc: "Manage limits & rewards", key: "ads_rewards_config", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Feature Toggles", desc: "Enable/disable features", key: "feature_toggles", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Bot Settings", desc: "Tokens & Configs", key: "bot_setting", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Support Management", desc: "Admin Contacts", key: "support", icon: <Settings className="w-5 h-5 text-green-400" /> },
          { title: "Privacy Policy", desc: "App Policies", key: "privacy_policy", icon: <FileText className="w-5 h-5 text-gray-400" /> },
          { title: "Terms & Conditions", desc: "App Terms", key: "terms", icon: <FileText className="w-5 h-5 text-gray-400" /> },
          { title: "About Us", desc: "Company Info", key: "about", icon: <FileText className="w-5 h-5 text-gray-400" /> },
        ]`;

const newList = `        {[
          { title: "Coin Values", desc: "Manage coin values", key: "coin_values", icon: <Coins className="w-5 h-5 text-yellow-400" /> },
          { title: "Ad & Rewards", desc: "Manage limits & rewards", key: "ads_rewards_config", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Feature Toggles", desc: "Enable/disable features", key: "feature_toggles", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Bot Settings", desc: "Tokens & Configs", key: "bot_setting", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Developer Profile", desc: "App Owner Info", key: "developer_profile", icon: <User className="w-5 h-5 text-purple-400" /> },
          { title: "VIP Plans", desc: "Manage Subscriptions", key: "vip_plan", icon: <Settings className="w-5 h-5 text-purple-400" /> },
          { title: "Support Management", desc: "Admin Contacts", key: "support", icon: <Settings className="w-5 h-5 text-green-400" /> },
          { title: "Privacy Policy", desc: "App Policies", key: "privacy_policy", icon: <FileText className="w-5 h-5 text-gray-400" /> },
          { title: "Terms & Conditions", desc: "App Terms", key: "terms", icon: <FileText className="w-5 h-5 text-gray-400" /> },
          { title: "About Us", desc: "Company Info", key: "about", icon: <FileText className="w-5 h-5 text-gray-400" /> },
        ]`;

code = code.replace(oldList, newList);
fs.writeFileSync('src/pages/Admin.tsx', code);
