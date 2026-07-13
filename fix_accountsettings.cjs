const fs = require('fs');
let code = fs.readFileSync('src/pages/AccountSettings.tsx', 'utf8');

code = code.replace(
  'import { User, Hash, Smartphone, Mail, Lock, Calendar, Eye, Sparkles, Bell } from "lucide-react";',
  'import { User, Hash, Smartphone, Mail, Lock, Calendar, Eye, EyeOff, Sparkles, Bell, Key, Save } from "lucide-react";'
);
fs.writeFileSync('src/pages/AccountSettings.tsx', code);
