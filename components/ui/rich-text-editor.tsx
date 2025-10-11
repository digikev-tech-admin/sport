'use client';

import React, { useRef, useEffect, forwardRef, useState } from 'react';
import type Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '@/styles/quill-editor.css';

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor = forwardRef<Quill, RichTextEditorProps>(
  ({ value = '', onChange, placeholder = 'Start writing...', height }, ref) => {
    const quillRef = useRef<Quill | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const isInitializedRef = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const editorIdRef = useRef(
      `quill-editor-${Math.random().toString(36).substr(2, 9)}`
    );
    const resizeData = useRef<{
      isResizing: boolean;
      startX: number;
      startY: number;
      startWidth: number;
      startHeight: number;
      handle: string;
      img: HTMLImageElement;
    } | null>(null);

    const minHeightPx = height ?? 200;

    const createResizeContainer = (img: HTMLImageElement) => {
      // Remove any existing resize containers
      const existingContainers = document.querySelectorAll(
        '.image-resize-container'
      );
      existingContainers.forEach((container) => container.remove());

      // Create a non-intrusive overlay that doesn't move the image
      const overlay = document.createElement('div');
      overlay.className = 'image-resize-overlay';
      overlay.style.position = 'absolute';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '1000';
      overlay.style.border = '2px dashed #3b82f6';
      overlay.style.borderRadius = '4px';

      // Position the overlay over the image
      const updateOverlayPosition = () => {
        const rect = img.getBoundingClientRect();
        const editorRect = editorRef.current?.getBoundingClientRect();

        if (editorRect) {
          overlay.style.left = `${
            rect.left - editorRect.left + editorRef.current!.scrollLeft
          }px`;
          overlay.style.top = `${
            rect.top - editorRect.top + editorRef.current!.scrollTop
          }px`;
          overlay.style.width = `${img.offsetWidth}px`;
          overlay.style.height = `${img.offsetHeight}px`;
        }
      };

      updateOverlayPosition();

      // Create resize handles
      const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];
      handles.forEach((handle) => {
        const handleElement = document.createElement('div');
        handleElement.className = `resize-handle ${handle}`;
        handleElement.style.pointerEvents = 'auto';
        handleElement.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          startResize(e, handle, img, overlay, updateOverlayPosition);
        });
        overlay.appendChild(handleElement);
      });

      // Create toolbar
      const toolbar = document.createElement('div');
      toolbar.className = 'image-toolbar';
      toolbar.style.pointerEvents = 'auto';

      // Size controls
      const sizeControls = document.createElement('div');
      sizeControls.className = 'size-controls';

      const widthLabel = document.createElement('span');
      widthLabel.textContent = 'W:';
      sizeControls.appendChild(widthLabel);

      const widthInput = document.createElement('input');
      widthInput.type = 'number';
      widthInput.value = img.offsetWidth.toString();
      widthInput.min = '50';
      widthInput.max = '800';
      widthInput.style.width = '60px';
      widthInput.onchange = (e) => {
        e.stopPropagation();
        const newWidth = parseInt(widthInput.value);
        if (newWidth >= 50 && newWidth <= 800) {
          img.style.width = `${newWidth}px`;
          img.style.height = 'auto';
          setTimeout(updateOverlayPosition, 10);
          heightInput.value = img.offsetHeight.toString();
        }
      };
      sizeControls.appendChild(widthInput);

      const heightLabel = document.createElement('span');
      heightLabel.textContent = 'H:';
      heightLabel.style.marginLeft = '10px';
      sizeControls.appendChild(heightLabel);

      const heightInput = document.createElement('input');
      heightInput.type = 'number';
      heightInput.value = img.offsetHeight.toString();
      heightInput.min = '50';
      heightInput.max = '600';
      heightInput.style.width = '60px';
      heightInput.onchange = (e) => {
        e.stopPropagation();
        const newHeight = parseInt(heightInput.value);
        if (newHeight >= 50 && newHeight <= 600) {
          img.style.height = `${newHeight}px`;
          img.style.width = 'auto';
          setTimeout(updateOverlayPosition, 10);
          widthInput.value = img.offsetWidth.toString();
        }
      };
      sizeControls.appendChild(heightInput);

      // Alignment buttons
      const alignButtons = [
        { align: 'left', icon: '⬅️', text: 'Left' },
        { align: 'center', icon: '⬌', text: 'Center' },
        { align: 'right', icon: '➡️', text: 'Right' },
      ];

      alignButtons.forEach(({ align, icon, text }) => {
        const button = document.createElement('button');
        button.innerHTML = `${icon}`;
        button.title = `Align ${text}`;
        button.onclick = (e) => {
          e.stopPropagation();
          setImageAlignment(img, align);
          setTimeout(updateOverlayPosition, 10);
        };
        toolbar.appendChild(button);
      });

      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '🗑️';
      deleteButton.title = 'Delete Image';
      deleteButton.onclick = (e) => {
        e.stopPropagation();
        img.remove();
        overlay.remove();
      };

      // Done button
      const doneButton = document.createElement('button');
      doneButton.innerHTML = '✓';
      doneButton.title = 'Done';
      doneButton.onclick = (e) => {
        e.stopPropagation();
        overlay.remove();
      };

      toolbar.appendChild(sizeControls);
      toolbar.appendChild(deleteButton);
      toolbar.appendChild(doneButton);
      overlay.appendChild(toolbar);

      // Make editor relative positioned and add overlay
      if (editorRef.current) {
        editorRef.current.style.position = 'relative';
        editorRef.current.appendChild(overlay);
      }

      // Close when clicking outside or when scrolling
      const closeOnOutsideClick = (e: MouseEvent) => {
        if (!overlay.contains(e.target as Node) && e.target !== img) {
          overlay.remove();
          document.removeEventListener('click', closeOnOutsideClick);
          window.removeEventListener('scroll', updateOverlayPosition);
        }
      };

      const handleScroll = () => {
        updateOverlayPosition();
      };

      setTimeout(() => {
        document.addEventListener('click', closeOnOutsideClick);
        window.addEventListener('scroll', handleScroll, true);
      }, 100);

      // Update position on resize
      const resizeObserver = new ResizeObserver(() => {
        updateOverlayPosition();
      });
      resizeObserver.observe(img);

      return overlay;
    };

    const setImageAlignment = (img: HTMLImageElement, alignment: string) => {
      // Remove existing alignment classes
      img.classList.remove('align-left', 'align-center', 'align-right');
      img.style.float = '';
      img.style.display = '';
      img.style.margin = '';

      if (alignment === 'left') {
        img.classList.add('align-left');
      } else if (alignment === 'center') {
        img.classList.add('align-center');
      } else if (alignment === 'right') {
        img.classList.add('align-right');
      }
    };

    const startResize = (
      e: MouseEvent,
      handle: string,
      img: HTMLImageElement,
      overlay: HTMLElement,
      updatePosition: () => void
    ) => {
      e.preventDefault();
      e.stopPropagation();

      resizeData.current = {
        isResizing: true,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: img.offsetWidth,
        startHeight: img.offsetHeight,
        handle,
        img,
      };

      const handleResizeMove = (e: MouseEvent) => {
        if (!resizeData.current?.isResizing) return;

        const { startX, startY, startWidth, startHeight, handle, img } =
          resizeData.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new dimensions based on handle
        if (handle.includes('e')) newWidth = startWidth + deltaX;
        if (handle.includes('w')) newWidth = startWidth - deltaX;
        if (handle.includes('s')) newHeight = startHeight + deltaY;
        if (handle.includes('n')) newHeight = startHeight - deltaY;

        // Apply constraints
        newWidth = Math.max(50, Math.min(800, newWidth));
        newHeight = Math.max(50, Math.min(600, newHeight));

        // Update image
        img.style.width = `${newWidth}px`;
        img.style.height = `${newHeight}px`;

        // Update overlay position
        setTimeout(updatePosition, 10);
      };

      const handleResizeEnd = () => {
        if (resizeData.current) {
          resizeData.current.isResizing = false;
        }
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };

      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    };

    const handleImageClick = (img: HTMLImageElement) => {
      // Create or toggle resize container
      createResizeContainer(img);
    };

    useEffect(() => {
      const editorElement = editorRef.current;

      if (editorElement && !quillRef.current && !isInitializedRef.current) {
        isInitializedRef.current = true;
        setIsLoading(true);

        // Set unique ID for this editor instance
        editorElement.setAttribute('data-editor-id', editorIdRef.current);

        // Complete cleanup - remove only Quill-related elements from this editor
        const cleanup = () => {
          // Remove only toolbars that belong to this specific editor instance
          editorElement.querySelectorAll('.ql-toolbar').forEach((toolbar) => {
            toolbar.remove();
          });

          // Remove all container elements within our editor
          editorElement
            .querySelectorAll('.ql-container')
            .forEach((container) => container.remove());

          // Clear content completely
          editorElement.innerHTML = '';
        };

        // Initial cleanup
        cleanup();

        import('quill')
          .then(({ default: Quill }) => {
            // Final cleanup before creating instance
            cleanup();

            quillRef.current = new Quill(editorElement, {
              theme: 'snow',
              modules: {
                toolbar: {
                  container: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: [] }],
                    ['blockquote', 'link', 'image'],
                    ['undo', 'redo'],
                  ],
                  handlers: {
                    image: function () {
                      const input = document.createElement('input');
                      input.setAttribute('type', 'file');
                      input.setAttribute('accept', 'image/*');
                      input.click();

                      input.onchange = () => {
                        const file = input.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const quill = quillRef.current;
                            if (quill && e.target?.result) {
                              try {
                                const range = quill.getSelection() || {
                                  index: quill.getLength(),
                                  length: 0,
                                };
                                const index = Math.min(
                                  range.index,
                                  quill.getLength()
                                );
                                quill.insertEmbed(
                                  index,
                                  'image',
                                  e.target.result
                                );

                                // Add click handler to the newly inserted image after a longer delay
                                setTimeout(() => {
                                  const images =
                                    editorElement?.querySelectorAll('img');
                                  if (images) {
                                    images.forEach((img) => {
                                      if (!img.hasAttribute('data-clickable')) {
                                        img.setAttribute(
                                          'data-clickable',
                                          'true'
                                        );
                                        img.style.cursor = 'pointer';
                                        img.addEventListener('click', (e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleImageClick(
                                            img as HTMLImageElement
                                          );
                                        });
                                      }
                                    });
                                  }
                                }, 200);
                              } catch (error) {
                                console.error('Error inserting image:', error);
                                // Fallback: insert at the end
                                quill.insertEmbed(
                                  quill.getLength(),
                                  'image',
                                  e.target.result
                                );
                              }
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                    },
                    undo: () => {
                      quillRef.current?.history.undo();
                    },
                    redo: () => {
                      quillRef.current?.history.redo();
                    },
                  },
                },
                history: {
                  delay: 1000,
                  maxStack: 50,
                  userOnly: false,
                },
              },
              placeholder: placeholder,
              formats: [
                'header',
                'bold',
                'italic',
                'underline',
                'strike',
                'list',
                'align',
                'blockquote',
                'code-block',
                'code',
                'link',
                'image',
              ],
            });

            // Set initial content
            quillRef.current.root.innerHTML = value;

            // Handle text changes
            quillRef.current.on('text-change', (delta, oldDelta, source) => {
              if (source === 'user') {
                // User is actively typing
                setIsUserTyping(true);

                // Clear existing timeout
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                }

                // Set timeout to mark typing as finished after 2 seconds of inactivity
                typingTimeoutRef.current = setTimeout(() => {
                  setIsUserTyping(false);
                }, 2000);
              }

              const html = quillRef.current?.root.innerHTML;
              if (html) {
                onChange?.(html);
              }

              // Only set up click handlers for new images, not on every text change
              if (source === 'user') {
                setTimeout(() => {
                  const images = editorElement?.querySelectorAll(
                    'img:not([data-clickable])'
                  );
                  if (images) {
                    images.forEach((img) => {
                      const imageElement = img as HTMLImageElement;
                      imageElement.setAttribute('data-clickable', 'true');
                      imageElement.style.cursor = 'pointer';
                      imageElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageClick(imageElement);
                      });
                    });
                  }
                }, 50);
              }
            });

            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Failed to load Quill:', error);
            setIsLoading(false);
            isInitializedRef.current = false;
          });
      }

      // Cleanup function
      return () => {
        if (quillRef.current && editorElement) {
          // Clean up only this editor's Quill instance
          try {
            quillRef.current = null;
          } catch (error) {
            console.warn('Error cleaning up Quill instance:', error);
          }

          // Remove the unique identifier
          editorElement.removeAttribute('data-editor-id');

          // Clean up only this editor's elements
          editorElement
            .querySelectorAll('.ql-toolbar')
            .forEach((toolbar) => toolbar.remove());
          editorElement
            .querySelectorAll('.ql-container')
            .forEach((container) => container.remove());
          editorElement.innerHTML = '';

          isInitializedRef.current = false;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);

    // Handle value changes
    useEffect(() => {
      if (
        quillRef.current &&
        value !== undefined &&
        !isLoading &&
        !isUserTyping
      ) {
        const currentContent = quillRef.current.root.innerHTML;
        if (currentContent !== value) {
          quillRef.current.root.innerHTML = value;
        }
      }
    }, [value, isLoading, isUserTyping]);

    // Apply height to editor content area when available
    useEffect(() => {
      if (!isLoading && editorRef.current) {
        const qlEditor = editorRef.current.querySelector(
          '.ql-editor'
        ) as HTMLElement | null;
        if (qlEditor) {
          qlEditor.style.minHeight = `${minHeightPx}px`;
        }
        const qlContainer = editorRef.current.querySelector(
          '.ql-container'
        ) as HTMLElement | null;
        if (qlContainer) {
          qlContainer.style.minHeight = `${minHeightPx}px`;
        }
      }
    }, [isLoading, minHeightPx]);

    // Expose Quill instance to parent
    React.useImperativeHandle(ref, () => quillRef.current!);

    return (
      <div className={`rounded-[0.5rem] overflow-hidden resize-y`}>
        {isLoading && (
          <div className="border border-gray-300 rounded-[0.5rem] bg-white">
            <div className="bg-gray-50 border-b border-gray-300 p-2 rounded-t-[0.5rem]">
              <div className="flex gap-1">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div
              className="p-4 min-h-[200px] bg-white rounded-b-[0.5rem]"
              style={{ minHeight: minHeightPx }}
            >
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
        )}
        <div
          ref={editorRef}
          style={{
            display: isLoading ? 'none' : 'block',
            minHeight: minHeightPx,
          }}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
