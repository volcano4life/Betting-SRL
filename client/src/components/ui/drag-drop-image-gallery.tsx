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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './card';
import { X, Star } from 'lucide-react';
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
      className={`relative bg-background border rounded-md overflow-hidden cursor-move w-32 h-32 ${isPrimary ? 'ring-2 ring-primary border-primary' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="relative w-full h-full">
        <img 
          src={url.includes('/') ? url : `/assets/${url}.jpg`} 
          alt={`Gallery image ${index + 1}`} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="absolute top-0 right-0 flex gap-1 p-1">
        {isPrimary && (
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            <Star className="h-3 w-3" />
          </div>
        )}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="bg-white/80 hover:bg-destructive hover:text-white rounded-full p-1 text-black transition-colors"
          title="Remove image"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      
      {!isPrimary && (
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onSetPrimary(id);
          }}
          title="Set as primary image"
        >
          <div className="bg-white/80 rounded-full p-1.5 opacity-0 hover:opacity-100 group-hover:opacity-80 hover:bg-primary hover:text-white">
            <Star className="h-4 w-4" />
          </div>
        </button>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 truncate">
        {url.split('/').pop()}
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
  labels = {
    addImage: "Add Image",
    noImages: "No images added yet. Add your first image above.",
    placeholder: "Enter image name (e.g., redmoon1, redmoon2)"
  }
}: DragDropImageGalleryProps & {
  labels?: {
    addImage: string;
    noImages: string;
    placeholder: string;
  }
}) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Initialize items from props
  useEffect(() => {
    setItems(images.map((url, index) => ({
      id: `image-${index}`,
      url,
    })));
  }, [images]);
  
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
    
    // Clean the URL - remove any file extension if added by the user
    const cleanUrl = newImageUrl.trim().replace(/\.(jpg|jpeg|png|gif)$/i, '');
    
    // Add the new image
    onAddImage(cleanUrl);
    
    // Update local state
    setItems(prev => [...prev, {
      id: `image-${prev.length}`,
      url: cleanUrl,
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
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <strong>Image Naming Guide:</strong> Enter image names exactly as shown below - no paths, no extensions.
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Available images: redmoon1, redmoon2, redmoon3, redmoon4, redmoon5</li>
            <li>DO NOT include .jpg extension or /assets/ path</li>
            <li>Just type: redmoon1</li>
          </ul>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder={labels.placeholder}
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newImageUrl.trim()) {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <Button 
            onClick={addImage}
            disabled={!newImageUrl.trim()}
          >
            {labels.addImage}
          </Button>
        </div>
      </div>
      
      <Card className="p-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="text-xs text-muted-foreground mb-3">
            {items.length > 0 && "Drag images to reorder. The first image will be used as the primary image."}
          </div>
          
          <SortableContext 
            items={items.map(item => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <div className="col-span-full text-center py-8 bg-muted/20 rounded-md border border-dashed text-muted-foreground">
                  {labels.noImages}
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </Card>
    </div>
  );
}