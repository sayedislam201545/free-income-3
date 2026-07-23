const fs = require('fs');
let code = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');

const target = `// Record transaction for sender
        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          username: user.username,
          type: 'transfer_out',
          method: 'P2P Transfer',
          amount: numAmount,
          currency: 'VA',
          status: 'completed',
          timestamp: new Date().toISOString(),
          receiverId: targetUid,
          receiverName: receiverName
        });`;

const replacement = `// Record transaction for sender
        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          username: user.username,
          type: 'transfer_out',
          method: 'P2P Transfer',
          amount: numAmount,
          currency: 'VA',
          status: 'completed',
          timestamp: new Date().toISOString(),
          receiverId: targetUid,
          receiverName: receiverName
        });
        
        // Record transaction for receiver
        await addDoc(collection(db, 'transactions'), {
          userId: targetUid,
          username: receiverName,
          type: 'transfer_in',
          method: 'P2P Transfer',
          amount: numAmount,
          currency: 'VA',
          status: 'completed',
          timestamp: new Date().toISOString(),
          senderId: user.uid,
          senderName: user.username
        });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Wallet.tsx', code);
