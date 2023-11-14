import DraggableResizableZone from "../../../common/DraggableResizableZone";

export default function FloorPlan({
                                      image,
                                      imgRef,
                                      setImageDimensions,
                                      zones,
                                      selectedZone,
                                      setZones,
                                      draggedZones,
                                      setDraggedZones,
                                      deleteZone
                                  }) {
    return (
        <div className="floor-plan-container">
            {image ? (
                <div style={{position: 'relative'}}>
                    <img
                        ref={imgRef}
                        src={image}
                        alt="Floor Plan"
                        onLoad={() => {
                            setImageDimensions({
                                width: imgRef.current.clientWidth,
                                height: imgRef.current.clientHeight,
                            });
                        }}
                    />
                    {zones.map((zone) => (
                        <DraggableResizableZone
                            key={zone.name}
                            zone={zone}
                            selectedZone={selectedZone}
                            zones={zones}
                            setZones={setZones}
                            draggedZones={draggedZones}
                            setDraggedZones={setDraggedZones}
                            deleteZone={deleteZone}
                        />
                    ))}
                </div>
            ) : (
                <div className="image-upload-placeholder">
                    <span className="image-upload-placeholder-text">&times;</span>
                </div>
            )}
        </div>
    );
}
