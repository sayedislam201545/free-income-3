const fs = require('fs');
let code = fs.readFileSync('src/pages/Achievements.tsx', 'utf8');

const oldStars = `<div className="flex justify-between items-center px-2 mb-6">
                  {Array.from({ length: starCount }).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 z-10 \${
                        i < filledStars 
                           ? 'bg-[#1E1145] border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.5)] text-yellow-500' 
                           : 'bg-[#1A1A32] border-white/10 text-gray-600'
                      }\`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      {/* Connecting line */}
                      {i < starCount - 1 && (
                        <div className={\`h-0.5 w-full mx-1 \${
                          i < filledStars - 1 ? 'bg-purple-500/50' : 'bg-white/5'
                        }\`} />
                      )}
                    </div>
                  ))}
                </div>`;

const newStars = `<div className="flex justify-between items-center px-1 mb-6 relative">
                  {/* Background connecting line */}
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-white/5 z-0" />
                  
                  {/* Foreground active connecting line */}
                  <div 
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-purple-500/50 z-0 transition-all duration-500" 
                    style={{ width: filledStars > 1 ? \`calc(\${(filledStars - 1) / (starCount - 1) * 100}% - 1rem)\` : '0%' }}
                  />

                  {Array.from({ length: starCount }).map((_, i) => (
                    <div key={i} className="relative z-10">
                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 shrink-0 \${
                        i < filledStars 
                           ? 'bg-[#1E1145] border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.5)] text-yellow-500' 
                           : 'bg-[#1A1A32] border-white/10 text-gray-600'
                      }\`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>`;

code = code.replace(oldStars, newStars);
fs.writeFileSync('src/pages/Achievements.tsx', code);
