import React, { useRef, useEffect, useState } from 'react';
import Element from './Element';
import { motion } from 'framer-motion';

const PageCanvas = ({ 
  elements, 
  onDrop, 
  onElementSelect, 
  onElementMove, 
  onElementResize, 
  selectedElement, 
  darkMode, 
  canvasColor 
}) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDrop(type, x, y);
  };

  const CoordinateCard = ({ position, value }) => (
    <motion.div
      className={`absolute ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md rounded-md px-2 py-1 text-xs font-semibold`}
      style={position}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {value}
    </motion.div>
  );

  const handleElementClick = (element) => {
    onElementSelect(element);
};

  return (
    <div
      ref={canvasRef}
      className="flex-1 p-4 overflow-hidden relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div 
        className="relative w-full h-full rounded-lg shadow-lg overflow-hidden border border-gray-200"
        style={{ backgroundColor: canvasColor }}
      >
        {elements.map((element) => (
          <Element
            key={element.id}
            element={element}
            onSelect={() => handleElementClick(element)}
            onMove={onElementMove}
            onResize={onElementResize}
            isSelected={selectedElement && selectedElement.id === element.id}
            canvasSize={canvasSize}
          />
        ))}
      </div>

      <CoordinateCard position={{ top: 4, left: 4 }} value="0, 0" />
      <CoordinateCard position={{ top: 4, right: 4 }} value={`${Math.round(canvasSize.width)}, 0`} />
      <CoordinateCard position={{ bottom: 4, left: 4 }} value={`0, ${Math.round(canvasSize.height)}`} />
      <CoordinateCard position={{ bottom: 4, right: 4 }} value={`${Math.round(canvasSize.width)}, ${Math.round(canvasSize.height)}`} />
    </div>
  );
};

export default PageCanvas;