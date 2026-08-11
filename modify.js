const fs = require('fs');

let content = fs.readFileSync('d:/Claude code/VictoryAdz/components/originkit/ui/we-most-proud-of.tsx', 'utf8');

// 1. Remove SpinningPoster import since we aren't using it anymore
content = content.replace('import SpinningPoster from "./SpinningPoster";', '');

// 2. Update WeMostProudOf state and handlers
const oldStateHandlers = `  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosing(false);
    }, 750);
  };`;

const newStateHandlers = `  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isPanelsVisible, setIsPanelsVisible] = useState(false);

  const handleItemClick = (item: WorkItem) => {
    setSelectedItem(item);
    setIsClosing(false);
    setIsPanelsVisible(false);
    // Wait for the layout spin+scale transition to complete before panels slide in
    setTimeout(() => {
      setIsPanelsVisible(true);
    }, 700);
  };

  const handleCloseModal = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsPanelsVisible(false); // Panels slide out instantly

    // Wait for panels to slide out, then unmount modal to trigger reverse layout spin
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosing(false);
    }, 600);
  };`;
content = content.replace(oldStateHandlers, newStateHandlers);

// 3. Update GridItemWithParallax call
const oldGridCall = `                  setSelectedItem={setSelectedItem}
                />`;
const newGridCall = `                  handleItemClick={handleItemClick}
                />`;
content = content.replace(oldGridCall, newGridCall);

// 4. Replace the entire Modal AnimatePresence block
const modalStart = `{/* Editorial Work Detail Modal - Responsive Desktop & Mobile Views */}`;
const modalEndRegex = /\{\/\* Editorial Work Detail Modal.*?\<\/AnimatePresence\>/s;

const newModalJSX = `{/* Editorial Work Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 pointer-events-none flex p-0 m-0 w-screen h-screen overflow-hidden">
            
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-[#1c1c1c] pointer-events-auto"
            />

            {/* --- DESKTOP LEFT PANEL --- */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: isPanelsVisible ? 0 : "-100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="hidden lg:flex absolute left-0 top-0 bottom-0 flex-col w-14 lg:w-16 bg-[#1c1c1c] p-0 gap-0 overflow-y-auto no-scrollbar shrink-0 z-20 pointer-events-auto"
            >
              {WORK_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={\`relative aspect-[3/4] w-full overflow-hidden transition-all duration-300 cursor-pointer rounded-none border-0 \${
                    selectedItem.id === item.id
                      ? "brightness-100 opacity-100"
                      : "brightness-[0.45] opacity-50 hover:brightness-90 hover:opacity-90"
                  }\`}
                >
                  <Image src={item.image} alt={item.lastName} fill unoptimized className="object-cover object-center" />
                </button>
              ))}
            </motion.div>

            {/* --- MOBILE TOP PANEL --- */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: isPanelsVisible ? 0 : "-100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="flex lg:hidden absolute top-0 left-0 right-0 flex-col gap-1.5 p-5 bg-black shrink-0 z-20 pointer-events-auto"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5 font-sans">
                  <span className="text-xs text-white/80 tracking-wide font-normal">{selectedItem.date}</span>
                  <span className="text-[11px] text-white/60 font-normal uppercase tracking-wider">{selectedItem.credits}</span>
                </div>
                <button onClick={handleCloseModal} aria-label="Close" className="w-8 h-8 bg-white/15 text-white flex items-center justify-center text-xs font-mono hover:bg-white/30 transition-colors cursor-pointer rounded-none">✕</button>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2 leading-none">{selectedItem.lastName}</h2>
            </motion.div>

            {/* --- SHARED CENTER IMAGE (Framer Motion LayoutId) --- */}
            <div className="relative flex-1 h-full overflow-hidden flex items-center justify-center p-0 m-0 z-10 pointer-events-none">
              <motion.div
                layoutId={\`shared-image-\${selectedItem.id}\`}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                exit={{ rotateY: 0 }}
                transition={{
                  layout: { type: "spring", damping: 25, stiffness: 120, duration: 0.7 },
                  rotateY: { type: "spring", damping: 25, stiffness: 120, duration: 0.7 }
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-auto h-[60vh] lg:h-[95vh] aspect-[3/4] overflow-hidden pointer-events-auto shadow-2xl bg-[#363636]"
              >
                <Image src={selectedItem.image} alt={selectedItem.lastName} fill unoptimized className="object-cover object-center" />
              </motion.div>
            </div>

            {/* --- DESKTOP RIGHT PANEL --- */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: isPanelsVisible ? 0 : "100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[420px] bg-white text-black p-6 lg:p-12 flex-col justify-between overflow-hidden shrink-0 z-20 pointer-events-auto"
            >
              {/* Top Meta Row */}
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col gap-2 font-sans">
                  <span className="font-mono text-xs text-black/70 tracking-wider">{selectedItem.number}</span>
                  <span className="font-sans text-xs text-black/70 font-normal tracking-wide">{selectedItem.date}</span>
                  <span className="font-sans text-[11px] text-black/60 font-normal uppercase tracking-wider">{selectedItem.credits}</span>
                </div>
                <button onClick={handleCloseModal} aria-label="Close" className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-mono hover:bg-neutral-800 transition-colors cursor-pointer shrink-0">✕</button>
              </div>

              {/* Bottom Left Title */}
              <div className="mt-auto pt-10 flex flex-col gap-1 overflow-hidden">
                <p className="font-serif text-xl md:text-2xl lg:text-3xl text-neutral-800 font-normal">{selectedItem.firstName}</p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-black uppercase leading-none break-words">{selectedItem.lastName}</h2>
              </div>
            </motion.div>

            {/* --- MOBILE BOTTOM PANEL --- */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: isPanelsVisible ? 0 : "100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="flex lg:hidden absolute bottom-0 left-0 right-0 items-center gap-1.5 overflow-x-auto no-scrollbar p-2 bg-black border-t border-white/10 shrink-0 z-20 pointer-events-auto"
            >
              {WORK_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={\`relative aspect-[3/4] w-12 sm:w-14 overflow-hidden flex-none transition-all duration-200 cursor-pointer rounded-none border-0 \${
                    selectedItem.id === item.id ? "brightness-100 opacity-100" : "brightness-[0.4] opacity-40 hover:opacity-80"
                  }\`}
                >
                  <Image src={item.image} alt={item.lastName} fill unoptimized className="object-cover object-center" />
                </button>
              ))}
            </motion.div>

          </div>
        )}
      </AnimatePresence>`;

content = content.replace(modalEndRegex, newModalJSX);


// 5. Update GridItemWithParallax props and internal usage
content = content.replace('setSelectedItem: (item: WorkItem) => void;', 'handleItemClick: (item: WorkItem) => void;');
content = content.replace('setSelectedItem,', 'handleItemClick,');
content = content.replace('onClick={() => setSelectedItem(item)}', 'onClick={() => handleItemClick(item)}');

// 6. Wrap inner image inside GridItemWithParallax with motion.div for layoutId sharing
const oldInnerImageJSX = `<div
            className="relative overflow-hidden bg-[#363636] w-full aspect-[3/4] lg:h-[221px]"
          >
            <Image
              src={item.image}
              alt={item.lastName}
              fill
              unoptimized
              className="object-cover object-center"
              sizes="(max-width: 640px) 140px, 166px"
            />`;

const newInnerImageJSX = `<motion.div
            layoutId={\`shared-image-\${item.id}\`}
            className="relative overflow-hidden bg-[#363636] w-full aspect-[3/4] lg:h-[221px]"
          >
            <Image
              src={item.image}
              alt={item.lastName}
              fill
              unoptimized
              className="object-cover object-center"
              sizes="(max-width: 640px) 140px, 166px"
            />`;
content = content.replace(oldInnerImageJSX, newInnerImageJSX);

fs.writeFileSync('d:/Claude code/VictoryAdz/components/originkit/ui/we-most-proud-of.tsx', content);
console.log('Successfully modified we-most-proud-of.tsx');
