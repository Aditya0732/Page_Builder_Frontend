import React, { useRef, useEffect, useState } from 'react';

const Element = ({ element, onSelect, onMove, isSelected, canvasSize }) => {
  const elementRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (el) {
      el.style.transform = `translate(${element.x}px, ${element.y}px)`;
    }
  }, [element.x, element.y]);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    onSelect(element);

    const startX = clientX;
    const startY = clientY;
    const startLeft = element.x;
    const startTop = element.y;

    const handleMove = (moveClientX, moveClientY) => {
      const dx = moveClientX - startX;
      const dy = moveClientY - startY;
      const newX = Math.max(0, Math.min(startLeft + dx, canvasSize.width - element.width));
      const newY = Math.max(0, Math.min(startTop + dy, canvasSize.height - element.height));
      onMove(element.id, newX, newY);
    };

    const handleEnd = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseUp = handleEnd;
    const handleTouchEnd = handleEnd;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(element);
  };

  const renderElement = () => {
    switch (element.type) {
      case 'Label':
        return (
          <span 
            style={{ 
              color: element.color,
              fontSize: `${element.fontSize || 16}px`,
              fontWeight: element.fontWeight || 'normal',
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {element.content}
          </span>
        );
      case 'Input':
        return (
          <input 
            type="text"
            placeholder={`${element.content}`}
            className="border p-1" 
            style={{ 
              color: element.color, 
              width: '100%', 
              height: '100%'
            }} 
          />
        );
      case 'Button':
        return (
          <button 
            className="text-white px-2 py-1 rounded" 
            style={{ 
              backgroundColor: element.color,
              width: '100%', 
              height: '100%'
            }}
          >
            {element.content}
          </button>
        );
      case 'Image':
        return <img src={element.content} alt="User uploaded" className="w-full h-full object-cover" />;
      case 'Shape':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.color,
              borderRadius: element.shape === 'circle' ? '50%' : element.shape === 'triangle' ? '0' : '4px',
              clipPath: element.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        width: element.type === 'Label' ? 'auto' : element.width,
        height: element.type === 'Label' ? 'auto' : element.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      {renderElement()}
    </div>
  );
};

export default Element;