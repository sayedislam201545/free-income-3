const fs = require('fs');
let code = fs.readFileSync('src/pages/Refer.tsx', 'utf8');

const targetCode = `        {/* Invite Code Input */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-purple-100/80 relative overflow-hidden mb-4">`;

const replacementCode = `        {/* Invite Code Input */}
        {!user?.referredBy && (
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-purple-100/80 relative overflow-hidden mb-4">`;

code = code.replace(targetCode, replacementCode);

// Add the closing brace and parenthesis.
// To do this reliably, we can replace the matching end of that block.
// The end of the block is:
//               </button>
//            </div>
//         </div>

const targetEnd = `              </button>
           </div>
        </div>`;

const replacementEnd = `              </button>
           </div>
        </div>
        )}`;

code = code.replace(targetEnd, replacementEnd);
fs.writeFileSync('src/pages/Refer.tsx', code);
console.log("Refer page invite code section wrapped with condition.");
