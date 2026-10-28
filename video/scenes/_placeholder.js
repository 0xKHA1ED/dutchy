// Stand-in for a scene that has not been animated yet.
SCENE({ draw(ctx, t, dur) { const K = KIT; K.sky(ctx, 'night'); K.steam(ctx, t, 0.5); K.finish(ctx, t); K.fadeEdges(ctx, t, dur, 0.6, 0.6); } });
