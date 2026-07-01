"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Strategy = "vertical" | "horizontal";

/**
 * Wraps a list of SortableItems in a drag-and-drop context. `ids` must be the
 * stable identifiers of the current items (their index as a string works for
 * simple reorder-only lists). `onReorder(oldIndex, newIndex)` fires on drop.
 * Supports pointer + keyboard reordering out of the box.
 */
export function SortableList({
  ids,
  onReorder,
  strategy = "vertical",
  children,
}: {
  ids: string[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  strategy?: Strategy;
  children: React.ReactNode;
}) {
  const sensors = useSensors(
    // Require a small drag distance so clicks on nested buttons still work.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex !== -1 && newIndex !== -1) onReorder(oldIndex, newIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={ids}
        strategy={
          strategy === "vertical"
            ? verticalListSortingStrategy
            : horizontalListSortingStrategy
        }
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}

export interface SortableRenderProps {
  setNodeRef: (node: HTMLElement | null) => void;
  style: React.CSSProperties;
  /** Spread onto the drag-handle element together with `listeners`. */
  attributes: React.HTMLAttributes<HTMLElement>;
  /** Spread onto the drag-handle element. */
  listeners: Record<string, Function> | undefined;
  isDragging: boolean;
}

/**
 * Renders a single sortable item via a render prop, exposing the node ref +
 * transform style (put on the item root) and the drag handle attributes/
 * listeners (put on whatever element should be the drag handle).
 */
export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (props: SortableRenderProps) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <>
      {children({
        setNodeRef,
        style,
        attributes: attributes as React.HTMLAttributes<HTMLElement>,
        listeners,
        isDragging,
      })}
    </>
  );
}

/** Six-dot drag-handle icon. */
export function GripIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="7" cy="5" r="1.4" />
      <circle cx="13" cy="5" r="1.4" />
      <circle cx="7" cy="10" r="1.4" />
      <circle cx="13" cy="10" r="1.4" />
      <circle cx="7" cy="15" r="1.4" />
      <circle cx="13" cy="15" r="1.4" />
    </svg>
  );
}
