import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './card';
import { Trash, GripVertical, Star, StarOff } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface DraggableImageProps {
  id: string;
  url: string;
  index: number;
  isPrimary: boolean;
  onRemove: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

function DraggableImage({ 
  id, 
  url, 
  index, 
  isPrimary, 
  onRemove, 
  onSetPrimary 
}: DraggableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center bg-background border rounded-md p-2 mb-2 group"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab mr-2 text-muted-foreground hover:text-foreground"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="relative mr-2 flex-shrink-0">
        <img 
          src={url} 
          alt={`Gallery image ${index + 1}`} 
          className="h-16 w-16 object-cover rounded-md" 
        />
        {isPrimary && (
          <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full p-1">
            <Star size={12} />
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="text-sm font-medium">Image {index + 1}</div>
        <div className="text-xs text-muted-foreground truncate">{url.split('/').pop()}</div>
      </div>
      
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isPrimary && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onSetPrimary(id)}
            title="Set as primary image"
          >
            <StarOff size={16} />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive hover:text-destructive" 
          onClick={() => onRemove(id)}
          title="Remove image"
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
}

interface ImageItem {
  id: string;
  url: string;
}

interface DragDropImageGalleryProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void;
  primaryImage: string;
  onPrimaryChange: (newPrimary: string) => void;
  onAddImage: (newImage: string) => void;
}

export function DragDropImageGallery({
  images,
  onImagesChange,
  primaryImage,
  onPrimaryChange,
  onAddImage,
}: DragDropImageGalleryProps) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Initialize items from props
  useEffect(() => {
    setItems(images.map((url, index) => ({
      id: `image-${index}`,
      url,
    })));
  }, []);
  
  // Not using the dependency on images because we don't want
  // to reset the order when a parent rerenders
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Notify parent of the new image order
        onImagesChange(newItems.map(item => item.url));
        
        return newItems;
      });
    }
  }
  
  function addImage() {
    if (!newImageUrl.trim()) return;
    
    // Add the new image
    onAddImage(newImageUrl);
    
    // Update local state
    setItems(prev => [...prev, {
      id: `image-${prev.length}`,
      url: newImageUrl,
    }]);
    
    // Clear the input
    setNewImageUrl('');
  }
  
  function removeImage(id: string) {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;
    
    const newItems = [...items];
    newItems.splice(index, 1);
    
    // If removing the primary image, set the first remaining image as primary
    if (items[index].url === primaryImage && newItems.length > 0) {
      onPrimaryChange(newItems[0].url);
    }
    
    setItems(newItems);
    onImagesChange(newItems.map(item => item.url));
  }
  
  function setPrimaryImage(id: string) {
    const item = items.find(item => item.id === id);
    if (item) {
      onPrimaryChange(item.url);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter image filename (e.g., redmoon1)"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="flex-grow"
        />
        <Button 
          onClick={addImage}
          disabled={!newImageUrl.trim()}
        >
          Add Image
        </Button>
      </div>
      
      <Card className="p-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.length > 0 ? (
              items.map((item, index) => (
                <DraggableImage
                  key={item.id}
                  id={item.id}
                  url={item.url}
                  index={index}
                  isPrimary={item.url === primaryImage}
                  onRemove={removeImage}
                  onSetPrimary={setPrimaryImage}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No images added yet. Add your first image above.
              </div>
            )}
          </SortableContext>
        </DndContext>
      </Card>
    </div>
  );
}