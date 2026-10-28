// Example of KIT.shots with four quick shots (not part of the film).
SCENE({ draw(ctx, t, dur, B) { const K = KIT;
  K.shots(ctx, t, dur, [
    [0, (c, lt, p) => { K.dome(c, lt); K.steam(c, lt, 0.9); K.woman(c, 640, 640, 1.2, { color: '#1c2324', robe: 'towel', t: lt, width: 1.3 }); K.woman(c, 860, 650, 1.1, { color: '#1c2324', pose: 'sit', t: lt, width: 0.8 }); K.particles(c, lt, { color: K.MOODS.hammam.dust }); }],
    [4, (c, lt, p) => { K.sky(c, 'warm'); K.bulb(c, 900, 200, lt); K.profile(c, 560 + p * 20, 380, 1.3, { scarf: '#6b3b4f', earring: true, rim: K.C.lamp, t: lt, tilt: 0.1 }); K.particles(c, lt, {}); }],
    [8, (c, lt, p) => { K.sky(c, 'hammam'); K.tileFloor(c, 300); K.slipper(c, 300, 560, 1, '#c4473f', 0.2); K.slipper(c, 420, 590, 1, '#3f7fbf', -0.1); K.shoePair(c, 600, 520, 1.3, 'sandal'); K.shoePair(c, 860, 520, 1.3, 'ballet'); K.drop(c, lt, 340, 0, 555, 1, 2); K.steam(c, lt, 0.5); }],
    [12, (c, lt, p) => { K.sky(c, 'night'); K.till(c, 640, 560, 1.2, '2,00 DH', lt); K.hand(c, 480, 470, 0.8); K.coin(c, 520, 380, 18, lt, 2); K.notebook(c, 900, 360, 0.9, 6, lt, p); }],
  ]);
  K.finish(ctx, t); } });
