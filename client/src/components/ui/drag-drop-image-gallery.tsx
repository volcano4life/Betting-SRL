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
import { X, Star, Plus } from 'lucide-react';
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
          onError={(e) => {
            // Try different formats if the image doesn't load
            const target = e.target as HTMLImageElement;
            const currentUrl = target.src;
            
            // If already at attempt 3, use a placeholder image
            if (currentUrl.includes('fallback-attempt=3')) {
              console.log('Final fallback for', url);
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
              target.className = 'w-full h-full object-contain p-2 bg-gray-100';
              return;
            }

            // If it contains a full URL path, don't try variations
            if (url.includes('/')) {
              console.log('Skipping fallbacks for full URL:', url);
              return;
            }
            
            // Check which attempt we're on
            let attemptNum = 1;
            if (currentUrl.includes('fallback-attempt=1')) {
              attemptNum = 2;
            } else if (currentUrl.includes('fallback-attempt=2')) {
              attemptNum = 3;
            }
            
            // Try different paths based on the attempt number
            if (attemptNum === 1) {
              // Try with outlets folder
              target.src = `/assets/outlets/${url}.jpg?fallback-attempt=1`;
            } else if (attemptNum === 2) {
              // Try with hyphenated version (redmoon-1 instead of redmoon1)
              const hyphenated = url.replace(/(\d+)$/, '-$1');
              target.src = `/assets/outlets/${hyphenated}.jpg?fallback-attempt=2`;
            } else {
              // Try just by name without the outlets folder
              const baseName = url.split('/').pop();
              target.src = `/assets/${baseName}.jpg?fallback-attempt=3`;
            }
            
            console.log(`Attempt ${attemptNum} for ${url}: ${target.src}`);
          }}
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
            e.preventDefault();
            console.log("Remove button clicked for image:", id);
            onRemove(id);
          }}
          className="bg-white/80 hover:bg-destructive hover:text-white rounded-full p-1 text-black transition-colors shadow-sm"
          title="Remove image"
          type="button" 
          aria-label="Remove image"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      
      {!isPrimary && (
        <button
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Set primary button clicked for image:", id);
            onSetPrimary(id);
          }}
          title="Set as primary image"
          type="button"
          aria-label="Set as primary image"
        >
          <div className="bg-white/80 rounded-full p-1.5 opacity-0 hover:opacity-100 group-hover:opacity-80 hover:bg-primary hover:text-white shadow-sm">
            <Star className="h-4 w-4" />
          </div>
        </button>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 truncate">
        {url.includes('/') ? url.split('/').pop() : url}
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
  // Log initial props for debugging
  console.log("DragDropImageGallery initialized with:", {
    images,
    primaryImage,
  });
  const [items, setItems] = useState<ImageItem[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Initialize and update items from props when images array changes
  useEffect(() => {
    // This effect should only sync from props -> state
    // and avoid circular updates when removing images
    
    // Only update if the arrays have different content
    const currentUrls = items.map(item => item.url);
    const incomingUrls = images;
    
    // Simple array comparison - if arrays are different sizes or have different elements,
    // they need to be synchronized
    const areArraysDifferent = (arr1: string[], arr2: string[]) => {
      if (arr1.length !== arr2.length) return true;
      
      // Do deep comparison of array elements
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return true;
      }
      return false;
    };
    
    if (areArraysDifferent(currentUrls, incomingUrls)) {
      console.log("Updating gallery items from props:", images);
      
      // Generate new stable IDs to prevent flickering during reordering
      setItems(images.map((url, index) => ({
        id: `image-${index}-${url}`, // Include URL in ID for stability
        url,
      })));
    }
  }, [images]); // Only depend on images prop, not the items state
  
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
    
    // Check if image already exists in the gallery
    const imageExists = items.some(item => item.url === cleanUrl);
    if (imageExists) {
      console.log("Image already exists in gallery:", cleanUrl);
      setNewImageUrl('');
      return;
    }
    
    console.log("Adding new image to gallery:", cleanUrl);
    
    // Add the new image
    onAddImage(cleanUrl);
    
    // Update local state with a stable ID
    const newId = `image-${Date.now()}-${cleanUrl}`;
    setItems(prev => [...prev, {
      id: newId,
      url: cleanUrl,
    }]);
    
    // Clear the input
    setNewImageUrl('');
  }
  
  function removeImage(id: string) {
    // This is the critical function for image removal
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      console.error("Cannot remove image - ID not found:", id);
      return;
    }
    
    const imageToRemove = items[index].url;
    console.log("Removing image:", imageToRemove, "at index:", index);
    
    // Create a new items array without the removed image
    const newItems = items.filter((_, i) => i !== index);
    
    // Create the new array of image URLs (this is what gets passed to the parent)
    const newImageUrls = newItems.map(item => item.url);
    console.log("After removal - New images array:", newImageUrls);
    
    // Update primary image if needed
    const wasPrimary = imageToRemove === primaryImage;
    if (wasPrimary) {
      if (newItems.length > 0) {
        // Set first remaining image as primary
        const newPrimaryUrl = newItems[0].url;
        console.log("Primary image was removed, setting new primary to:", newPrimaryUrl);
        onPrimaryChange(newPrimaryUrl);
      } else {
        // No images left, clear primary
        console.log("Last image was removed, setting primary to empty string");
        onPrimaryChange('');
      }
    }
    
    // Update local state and parent state
    setItems(newItems);
    
    // Important - must call this to update parent form state
    onImagesChange(newImageUrls);
  }
  
  function setPrimaryImage(id: string) {
    const item = items.find(item => item.id === id);
    if (item) {
      console.log("Setting primary image to:", item.url);
      onPrimaryChange(item.url);
      
      // Reorder items to put the primary image first
      const newItems = [...items];
      const itemIndex = newItems.findIndex(i => i.id === id);
      
      if (itemIndex > 0) {
        // Move the selected item to the beginning of the array
        const [selectedItem] = newItems.splice(itemIndex, 1);
        newItems.unshift(selectedItem);
        
        // Update the images order
        const newImageUrls = newItems.map(item => item.url);
        console.log("After setting primary - New images array:", newImageUrls);
        setItems(newItems);
        onImagesChange(newImageUrls);
      }
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
        
        {/* Quick image selection grid */}
        <div className="mt-3">
          <p className="text-sm text-muted-foreground mb-2">Or click an image to add it quickly:</p>
          <div className="grid grid-cols-5 gap-2">
            {['redmoon1', 'redmoon2', 'redmoon3', 'redmoon4', 'redmoon5'].map(imgName => (
              <div 
                key={imgName}
                className="relative group cursor-pointer border rounded-md overflow-hidden h-14"
                onClick={() => {
                  // Check if image already exists
                  const imageExists = items.some(item => item.url === imgName);
                  if (imageExists) {
                    console.log("Quick-add: Image already exists in gallery:", imgName);
                    return;
                  }
                  
                  console.log("Quick-add: Adding new image to gallery:", imgName);
                  onAddImage(imgName);
                  
                  // Add to local state with stable ID
                  const newId = `image-${Date.now()}-${imgName}`;
                  setItems(prev => [...prev, {
                    id: newId,
                    url: imgName,
                  }]);
                }}
              >
                <img 
                  src={`/assets/${imgName}.jpg`} 
                  alt={imgName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const currentSrc = target.src;
                    
                    // If already tried all fallbacks
                    if (currentSrc.includes('fallback-attempt=3')) {
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                      target.className = 'w-full h-full object-contain p-2 bg-gray-100';
                      return;
                    }
                    
                    // Try different paths based on where we are in the fallback chain
                    if (!currentSrc.includes('fallback-attempt')) {
                      // First fallback - try outlets folder
                      target.src = `/assets/outlets/${imgName}.jpg?fallback-attempt=1`;
                    } else if (currentSrc.includes('fallback-attempt=1')) {
                      // Second fallback - try hyphenated filename
                      const hyphenated = imgName.replace(/(\d+)$/, '-$1');
                      target.src = `/assets/outlets/${hyphenated}.jpg?fallback-attempt=2`;
                    } else if (currentSrc.includes('fallback-attempt=2')) {
                      // Third fallback - try assets folder with hyphen
                      const hyphenated = imgName.replace(/(\d+)$/, '-$1');
                      target.src = `/assets/${hyphenated}.jpg?fallback-attempt=3`;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={16} className="text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 px-1 text-center">
                  {imgName}
                </div>
              </div>
            ))}
          </div>
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