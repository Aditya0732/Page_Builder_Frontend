import React, { useState, useEffect } from 'react';
import { FaTag, FaKeyboard, FaMousePointer, FaImage, FaShapes, FaPalette } from 'react-icons/fa';

const Sidebar = ({ darkMode, isOpen, onClose, canvasColor, onCanvasColorChange, onDrop }) => {
  const elements = [
    { type: 'Label', icon: FaTag },
    { type: 'Input', icon: FaKeyboard },
    { type: 'Button', icon: FaMousePointer },
    { type: 'Image', icon: FaImage },
    { type: 'Shape', icon: FaShapes },
  ];

  const [isDragging, setIsDragging] = useState(false);
  // const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleTouchStart = (e, type) => {
    // const touch = e.touches[0];
    // setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    e.target.dataset.type = type;
  };

  const handleTouchEnd = (e) => {
    if (isDragging) {
      const touch = e.changedTouches[0];
      const dropX = touch.clientX;
      const dropY = touch.clientY;
      const draggedElement = document.elementFromPoint(dropX, dropY);

      if (draggedElement && draggedElement.id === 'page-canvas') {
        const rect = draggedElement.getBoundingClientRect();
        const x = dropX - rect.left;
        const y = dropY - rect.top;
        onDrop(e.target.dataset.type, x, y);
      }

      setIsDragging(false);
      if (window.innerWidth <= 768) {
        onClose();
      }
    }
  };

  const handleCanvasColorChange = (e) => {
    onCanvasColorChange(e.target.value);
  };

  return (
    <div
      className={`fixed md:static md:block top-0 left-0 z-20 h-screen w-64 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } p-6 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
    >
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Elements</h2>
      <div className="space-y-4">
        {elements.map((element) => (
          <div
            key={element.type}
            draggable
            onDragStart={(e) => handleDragStart(e, element.type)}
            onTouchStart={(e) => handleTouchStart(e, element.type)}
            onTouchEnd={handleTouchEnd}
            className={`flex items-center p-3 rounded-lg cursor-move transition-all shadow-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            <element.icon className={`text-xl mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>{element.type}</span>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Canvas Color</h3>
        <div className="relative">
          <input
            type="color"
            value={canvasColor}
            onChange={handleCanvasColorChange}
            className="w-full h-10 cursor-pointer opacity-0 absolute top-0 left-0 z-10"
          />
          <div className="flex items-center justify-between p-2 rounded-md shadow-md" style={{ backgroundColor: canvasColor }}>
            <FaPalette className={`text-xl text-gray-800`} />
            <span className={`font-medium text-gray-800`}>{canvasColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;