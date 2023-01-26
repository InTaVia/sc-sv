import "maplibre-gl/dist/maplibre-gl.css";

import { forwardRef, useRef, useState, type LegacyRef } from "react";

import type { EntityEvent } from "@/api/intavia.models";

import {
  getTemporalExtent,
  type TimelineType,
} from "@/features/visualisations/timeline/timeline";

import { BeeSwarm } from "./beeSwarmTimeCluster";
import { PatisserieChart } from "./patisserieChart";
import { TimelineLabel } from "./timelineLabel";

import { TimelineColors as colors } from "@/features/visualisations/timeline/timeline";

interface ClusterBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

type TimelineEventClusterProps = {
  id: string;
  events: Array<EntityEvent>;
  vertical: boolean;
  timeScale: (toBeScaled: Date) => number;
  midOffset: number;
  timeScaleOffset: number;
  entityIndex: number;
  thickness: number;
  showLabels: boolean;
  clusterMode: "bee" | "pie" | "donut";
  mode?: TimelineType;
  diameter?: number;
};

export const TimelineEventCluster = forwardRef(
  (props: TimelineEventClusterProps, ref): JSX.Element => {
    const {
      id,
      events,
      vertical = false,
      timeScale,
      midOffset,
      timeScaleOffset,
      entityIndex,
      thickness,
      showLabels,
      clusterMode,
      diameter = 14,
      mode = "default",
    } = props;

    const [hover, setHover] = useState(false);
    const diameterWithStroke = diameter + thickness;

    let posX: number, posY: number;

    let className = "timeline-event";

    let eventsExtent = getTemporalExtent([events]);

    let bbox: ClusterBoundingBox = { x: 0, y: 0, width: 0, height: 0 };
    if (vertical) {
      bbox.x = midOffset + Math.floor(thickness / 2) - diameterWithStroke / 2;
      bbox.y = timeScale(eventsExtent[0]) - timeScaleOffset;
      bbox.width = diameterWithStroke;
      bbox.height = timeScale(eventsExtent[1]) - timeScaleOffset - bbox.y;
    } else {
      bbox.x = timeScale(eventsExtent[0]) - timeScaleOffset;
      bbox.y = midOffset + Math.floor(thickness / 2) - diameterWithStroke / 2;
      bbox.width = timeScale(eventsExtent[1]) - timeScaleOffset - bbox.x;
      bbox.height = diameterWithStroke;
    }

    posX = bbox.x + bbox.width / 2;
    posY = bbox.y + bbox.height / 2;

    const nodeRef = useRef();

    const clusterNodeHeight =
      // @ts-ignore
      nodeRef.current != null ? nodeRef.current.clientHeight : 0;

    const clusterNodeWidth =
      // @ts-ignore
      nodeRef.current != null ? nodeRef.current.clientWidth : 0;

    let clusterPosX = posX - clusterNodeWidth / 2;
    let clusterPosY = posY - clusterNodeHeight / 2;

    let width, height;
    let showExtent = true;

    let textPosX: number, textPosY: number;
    textPosX = clusterPosX + clusterNodeWidth / 2;
    textPosY = clusterPosY + clusterNodeHeight / 2;

    className = className + " hover-animation";

    return (
      <>
        {showExtent && (
          <div
            style={{
              position: "absolute",
              left: bbox.x,
              top: bbox.y,
              width: bbox.width,
              height: bbox.height,
              cursor: "pointer",
              backgroundColor: "teal",
              display: hover ? "block" : "none",
            }}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
          ></div>
        )}
        <div
          ref={ref as LegacyRef<HTMLDivElement>}
          style={{
            position: "absolute",
            left: clusterPosX,
            top: clusterPosY,
            cursor: "pointer",
          }}
          className={className}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          {clusterMode === "bee" ? (
            <BeeSwarm
              ref={nodeRef}
              events={events}
              width={bbox.width}
              height={bbox.height}
              vertical={vertical}
              dotRadius={diameterWithStroke / 3}
            />
          ) : (
            <PatisserieChart
              ref={nodeRef}
              events={events}
              diameter={diameterWithStroke}
              patisserieType={clusterMode}
            />
          )}
        </div>
        <TimelineLabel
          posX={textPosX}
          posY={textPosY}
          labelText={`${events.length} Events`}
          showLabels={showLabels}
          entityIndex={entityIndex}
          thickness={thickness}
          vertical={vertical}
          mode={mode}
        />
      </>
    );
  }
);