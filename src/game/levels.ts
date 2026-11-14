import { LevelData } from '../types';

export const LEVELS: LevelData[] = [
  // =========================================================================
  // 1. STEREO MADNESS (Easy ★1) - Chủ đề: Khởi Nguyên Nhịp Điệu
  // Thử thách: Căn nhịp nhảy đơn giản qua từng bệ vuông, leo cầu thang cơ bản
  // và đoạn Phi thuyền (Ship) bay thấp êm ái giữa không gian rộng mở.
  // =========================================================================
  {
    id: 'stereo_madness',
    name: 'Stereo Madness',
    vietnameseTitle: 'Khởi Nguyên Nhịp Điệu',
    difficulty: 'Easy',
    stars: 1,
    bpm: 130,
    trackLength: 280,
    baseSpeed: 10.8,
    songArtist: 'ForeverBound',
    songTrackName: 'Stereo Madness',
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    floorColor: '#0369a1',
    bgGradient: ['#0f172a', '#0369a1'],
    description: 'Thử thách cơ bản: Nhảy qua các khối vuông đơn, vượt chướng ngại vật đơn lẻ và lái phi thuyền mở đầu rộng rãi.',
    obstacles: [
      // Cube: Spaced single spikes and gentle platforms
      { id: 1, type: 'spike', x: 22, y: 0 },
      { id: 2, type: 'spike', x: 36, y: 0 },
      { id: 3, type: 'block', x: 48, y: 0, width: 3, height: 1 },
      { id: 4, type: 'pad_yellow', x: 58, y: 0 },
      { id: 5, type: 'block', x: 63, y: 2.5, width: 4, height: 1 },
      { id: 6, type: 'coin', x: 65, y: 5.5 }, // Secret Coin 1
      { id: 7, type: 'spike', x: 76, y: 0 },
      { id: 8, type: 'orb_yellow', x: 88, y: 1.8 },
      { id: 9, type: 'spike', x: 88, y: 0 },
      // Step stair climbing
      { id: 10, type: 'block', x: 100, y: 0, width: 2, height: 1 },
      { id: 11, type: 'block', x: 104, y: 0, width: 2, height: 2 },
      { id: 12, type: 'spike', x: 112, y: 0 },

      // Gentle Ship Section (Spacious 7.5-unit corridor)
      { id: 13, type: 'portal_ship', x: 125, y: 0 },
      { id: 14, type: 'block', x: 142, y: 0, width: 3, height: 2 },
      { id: 15, type: 'block', x: 162, y: 7.5, width: 3, height: 3 },
      { id: 16, type: 'coin', x: 163, y: 3.5 }, // Secret Coin 2
      { id: 17, type: 'block', x: 182, y: 0, width: 3, height: 2 },
      { id: 18, type: 'block', x: 202, y: 7.5, width: 3, height: 3 },

      // Cube Finish
      { id: 19, type: 'portal_cube', x: 218, y: 0 },
      { id: 20, type: 'spike', x: 232, y: 0 },
      { id: 21, type: 'orb_yellow', x: 244, y: 1.8 },
      { id: 22, type: 'spike', x: 244, y: 0 },
      { id: 23, type: 'pad_yellow', x: 254, y: 0 },
      { id: 24, type: 'coin', x: 258, y: 6.5 }, // Secret Coin 3
      { id: 25, type: 'block', x: 262, y: 2.5, width: 4, height: 1 },
      { id: 26, type: 'spike', x: 272, y: 0 },
    ],
  },

  // =========================================================================
  // 2. BACK ON TRACK (Easy ★2) - Chủ đề: Vương Quốc Đệm Nhảy (Pad Kingdom)
  // Thử thách: Chuyên biệt về ĐỆM NHẢY VÀNG (Yellow Pads). Liên tục phóng vút
  // qua các hố chông rộng lớn, nảy từ đệm sang bục cao rồi lại chạm đệm.
  // =========================================================================
  {
    id: 'back_on_track',
    name: 'Back On Track',
    vietnameseTitle: 'Vương Quốc Đệm Nhảy',
    difficulty: 'Easy',
    stars: 2,
    bpm: 134,
    trackLength: 300,
    baseSpeed: 11.2,
    songArtist: 'DJVI',
    songTrackName: 'Back On Track',
    primaryColor: '#22c55e',
    secondaryColor: '#eab308',
    floorColor: '#14532d',
    bgGradient: ['#052e16', '#15803d'],
    description: 'Thử thách đệm nhảy: Chuỗi đệm bật vàng liên hoàn phóng vút qua hố chông, cảm giác bay lượn tự động trên không trung.',
    obstacles: [
      // Pad Chain 1: Long launches
      { id: 101, type: 'pad_yellow', x: 24, y: 0 },
      { id: 102, type: 'spike', x: 28, y: 0 },
      { id: 103, type: 'spike', x: 30, y: 0 },
      { id: 104, type: 'block', x: 35, y: 2.5, width: 4, height: 1 },
      { id: 105, type: 'coin', x: 37, y: 5.5 }, // Coin 1
      { id: 106, type: 'pad_yellow', x: 46, y: 0 },
      { id: 107, type: 'spike', x: 50, y: 0 },
      { id: 108, type: 'spike', x: 52, y: 0 },
      { id: 109, type: 'block', x: 58, y: 3, width: 4, height: 1 },

      // Pad Chain 2: Multi-tier floating spring pads
      { id: 110, type: 'pad_pink', x: 72, y: 0 },
      { id: 111, type: 'block', x: 77, y: 2, width: 3, height: 1 },
      { id: 112, type: 'pad_yellow', x: 82, y: 2 },
      { id: 113, type: 'coin', x: 86, y: 6.5 }, // Coin 2
      { id: 114, type: 'block', x: 91, y: 4, width: 4, height: 1 },
      { id: 115, type: 'spike', x: 104, y: 0 },

      // Special Teleport Portal into Ship Section
      { id: 129, type: 'portal_teleport', x: 109, y: 0, targetX: 113, targetY: 5.5 },

      // Ship Section with floating arch
      { id: 116, type: 'portal_ship', x: 118, y: 0 },
      { id: 117, type: 'block', x: 135, y: 0, width: 3, height: 2.5 },
      { id: 118, type: 'block', x: 154, y: 7, width: 3, height: 3 },
      { id: 119, type: 'coin', x: 168, y: 5 }, // Coin 3
      { id: 120, type: 'block', x: 175, y: 0, width: 3, height: 2.5 },

      // Return to Cube Pad Finish
      { id: 121, type: 'portal_cube', x: 198, y: 0 },
      { id: 122, type: 'pad_yellow', x: 212, y: 0 },
      { id: 123, type: 'spike', x: 216, y: 0 },
      { id: 124, type: 'block', x: 224, y: 2.5, width: 4, height: 1 },
      { id: 125, type: 'pad_yellow', x: 238, y: 0 },
      { id: 126, type: 'spike', x: 242, y: 0 },
      { id: 127, type: 'block', x: 250, y: 3, width: 4, height: 1 },
      { id: 128, type: 'pad_yellow', x: 264, y: 0 },
    ],
  },

  // =========================================================================
  // 3. POLARGEIST (Normal ★3) - Chủ đề: Vũ Điệu Vòng Tròn Trên Không
  // Thử thách: Chuyên biệt về VÒNG NHẢY TRÊN KHÔNG (Yellow & Pink Orbs).
  // Yêu cầu nhấp phím khi đang rơi tự do, chuỗi 2-3 vòng liên hoàn trên không.
  // =========================================================================
  {
    id: 'polargeist',
    name: 'Polargeist',
    vietnameseTitle: 'Vũ Điệu Vòng Tròn Trên Không',
    difficulty: 'Normal',
    stars: 3,
    bpm: 138,
    trackLength: 320,
    baseSpeed: 11.8,
    songArtist: 'Step',
    songTrackName: 'Polargeist',
    primaryColor: '#a855f7',
    secondaryColor: '#06b6d4',
    floorColor: '#3b0764',
    bgGradient: ['#1e1b4b', '#581c87'],
    description: 'Thử thách nhào lộn trên không: Chuỗi vòng nhảy vàng và hồng liên hoàn giữa không trung đòi hỏi căn nhịp rơi chính xác.',
    obstacles: [
      { id: 201, type: 'spike', x: 24, y: 0 },
      // Orb Sequence 1: Double Mid-air catch
      { id: 202, type: 'orb_yellow', x: 36, y: 2.0 },
      { id: 203, type: 'spike', x: 36, y: 0 },
      { id: 204, type: 'orb_pink', x: 46, y: 2.8 }, // Pink micro-orb mid-air!
      { id: 205, type: 'block', x: 55, y: 2, width: 4, height: 1 },
      { id: 206, type: 'coin', x: 57, y: 5 }, // Coin 1

      // Orb Sequence 2: Triple Orb Skyway over massive spike bed
      { id: 207, type: 'spike', x: 70, y: 0 },
      { id: 208, type: 'spike', x: 74, y: 0 },
      { id: 209, type: 'orb_yellow', x: 72, y: 2.0 },
      { id: 210, type: 'orb_pink', x: 82, y: 3.2 },
      { id: 211, type: 'orb_yellow', x: 92, y: 2.5 },
      { id: 212, type: 'block', x: 102, y: 1.5, width: 4, height: 1 },
      { id: 213, type: 'coin', x: 104, y: 4.5 }, // Coin 2

      // Special Mini Portal for Ship section
      { id: 228, type: 'portal_mini', x: 112, y: 0 },

      // Ship Section with floating diamond hazard
      { id: 214, type: 'portal_ship', x: 120, y: 0 },
      { id: 215, type: 'block', x: 138, y: 0, width: 2, height: 2.5 },
      { id: 216, type: 'block', x: 156, y: 7, width: 2, height: 3 },
      { id: 217, type: 'coin', x: 168, y: 4.5 }, // Coin 3
      { id: 218, type: 'block', x: 176, y: 0, width: 2, height: 2 },

      // Restore Normal Size & High-air Orb Finale
      { id: 229, type: 'portal_normal', x: 192, y: 0 },
      { id: 219, type: 'portal_cube', x: 198, y: 0 },
      { id: 220, type: 'spike', x: 212, y: 0 },
      { id: 221, type: 'orb_yellow', x: 224, y: 2.2 },
      { id: 222, type: 'spike', x: 224, y: 0 },
      { id: 223, type: 'orb_pink', x: 236, y: 2.5 },
      { id: 224, type: 'pad_yellow', x: 248, y: 0 },
      { id: 225, type: 'block', x: 254, y: 3, width: 4, height: 1 },
      { id: 226, type: 'orb_yellow', x: 268, y: 4.5 },
      { id: 227, type: 'spike', x: 280, y: 0 },
    ],
  },

  // =========================================================================
  // 4. DRY OUT (Normal ★4) - Chủ đề: Thế Giới Đảo Ngược (Gravity Inversion)
  // Thử thách: Chạy ngược 180 độ trên TRẦN NHÀ! Né gai treo ngược,
  // nhảy giữa các bục treo trần và cảm giác rơi ngược về sàn.
  // =========================================================================
  {
    id: 'dry_out',
    name: 'Dry Out',
    vietnameseTitle: 'Thế Giới Đảo Ngược',
    difficulty: 'Normal',
    stars: 4,
    bpm: 142,
    trackLength: 340,
    baseSpeed: 12.2,
    songArtist: 'DJVI',
    songTrackName: 'Dry Out',
    primaryColor: '#f97316',
    secondaryColor: '#eab308',
    floorColor: '#7c2d12',
    bgGradient: ['#451a03', '#9a3412'],
    description: 'Thử thách đảo trọng lực: Cổng trọng lực lộn ngược 180° chạy trên trần nhà, né gai chông treo ngược và căn nhịp rơi đảo chiều.',
    obstacles: [
      { id: 301, type: 'spike', x: 24, y: 0 },
      { id: 302, type: 'block', x: 38, y: 0, width: 3, height: 1 },
      { id: 303, type: 'pad_yellow', x: 48, y: 0 },
      { id: 304, type: 'coin', x: 58, y: 4.5 }, // Coin 1
      { id: 305, type: 'block', x: 56, y: 2, width: 3, height: 1 },
      { id: 306, type: 'spike', x: 66, y: 0 },

      // === GRAVITY INVERSION: Running on the CEILING! ===
      { id: 307, type: 'portal_gravity_up', x: 78, y: 0 },
      { id: 308, type: 'spike_ceiling', x: 96, y: 9.5 },
      { id: 309, type: 'orb_yellow', x: 114, y: 6.5 },
      { id: 310, type: 'coin', x: 115, y: 5 }, // Coin 2 (caught mid-air)
      { id: 311, type: 'spike_ceiling', x: 128, y: 9.5 },
      { id: 312, type: 'orb_pink', x: 146, y: 7.0 },
      { id: 313, type: 'spike_ceiling', x: 158, y: 9.5 },

      // Return to normal gravity & ship flight
      { id: 314, type: 'portal_gravity_down', x: 180, y: 6.8 },
      { id: 315, type: 'portal_ship', x: 196, y: 0 },
      { id: 316, type: 'block', x: 216, y: 0, width: 3, height: 2 },
      { id: 317, type: 'block', x: 236, y: 8, width: 3, height: 2.5 },
      { id: 318, type: 'coin', x: 246, y: 4.5 }, // Coin 3
      { id: 319, type: 'block', x: 254, y: 0, width: 3, height: 1.5 },

      // Climax Cube Finish
      { id: 320, type: 'portal_cube', x: 268, y: 0 },
      { id: 321, type: 'spike', x: 282, y: 0 },
      { id: 322, type: 'orb_yellow', x: 294, y: 1.8 },
      { id: 323, type: 'spike', x: 294, y: 0 },
      { id: 324, type: 'pad_yellow', x: 306, y: 0 },
      { id: 325, type: 'block', x: 312, y: 2.5, width: 4, height: 1 },
      { id: 326, type: 'spike', x: 326, y: 0 },
    ],
  },

  // =========================================================================
  // 5. BASE AFTER BASE (Normal ★5) - Chủ đề: Vực Thẳm & Rơi Tự Do
  // Thử thách: Tháp cao chọc trời (y=4, y=5) và rơi tự do xuống khe hẹp
  // giữa 2 cột gai. Canh thời điểm nhả rơi và đệm nhảy dưới đáy vực.
  // =========================================================================
  {
    id: 'base_after_base',
    name: 'Base After Base',
    vietnameseTitle: 'Vực Thẳm & Rơi Tự Do',
    difficulty: 'Normal',
    stars: 5,
    bpm: 144,
    trackLength: 360,
    baseSpeed: 12.6,
    songArtist: 'DJVI',
    songTrackName: 'Base After Base',
    primaryColor: '#0ea5e9',
    secondaryColor: '#6366f1',
    floorColor: '#0c4a6e',
    bgGradient: ['#082f49', '#1e1b4b'],
    description: 'Thử thách vực thẳm: Leo lên các tháp cao 5 ô rồi lao thẳng xuống hẻm núi hẹp, đệm nảy dưới đáy vực sâu hun hút.',
    obstacles: [
      { id: 401, type: 'spike', x: 24, y: 0 },
      // Tower 1 (height 3) -> Deep Chasm Drop
      { id: 402, type: 'block', x: 36, y: 0, width: 3, height: 3 },
      { id: 403, type: 'coin', x: 37, y: 5.5 }, // Coin 1 on high tower
      { id: 404, type: 'spike', x: 44, y: 0 }, // Spike in chasm bottom
      { id: 405, type: 'pad_yellow', x: 48, y: 0 }, // Spring launches out
      { id: 406, type: 'block', x: 55, y: 0, width: 4, height: 2.5 }, // Tower 2 (accessible 2.5 height)

      // Drop into canyon
      { id: 407, type: 'spike', x: 65, y: 0 },
      { id: 408, type: 'orb_yellow', x: 73, y: 2.2 },
      { id: 409, type: 'block', x: 82, y: 0, width: 4, height: 2 },
      { id: 410, type: 'pad_pink', x: 92, y: 0 },
      { id: 411, type: 'coin', x: 96, y: 5 }, // Coin 2

      // Deep Trench Ship (Fly low near the jagged trench bottom at 2x speed!)
      { id: 425, type: 'portal_speed_2x', x: 104, y: 0 },
      { id: 412, type: 'portal_ship', x: 110, y: 0 },
      { id: 413, type: 'block', x: 130, y: 0, width: 3, height: 3.5 },
      { id: 414, type: 'block', x: 150, y: 6.5, width: 3, height: 4 },
      { id: 415, type: 'coin', x: 165, y: 3 }, // Coin 3 in trench
      { id: 416, type: 'block', x: 172, y: 0, width: 3, height: 3 },
      { id: 417, type: 'block', x: 192, y: 6.5, width: 3, height: 4 },

      // Cube Finish: High Tower Leap
      { id: 426, type: 'portal_speed_1x', x: 209, y: 0 },
      { id: 418, type: 'portal_cube', x: 215, y: 0 },
      { id: 419, type: 'block', x: 232, y: 0, width: 3, height: 2.5 },
      { id: 420, type: 'orb_yellow', x: 242, y: 3.2 },
      { id: 421, type: 'block', x: 252, y: 0, width: 3, height: 2 },
      { id: 422, type: 'pad_yellow', x: 264, y: 0 },
      { id: 423, type: 'block', x: 270, y: 2.5, width: 4, height: 1 },
      { id: 424, type: 'spike', x: 284, y: 0 },
    ],
  },

  // =========================================================================
  // 6. CAN'T LET GO (Hard ★6) - Chủ đề: Bục Nhảy Tử Thần & Gai Đỉnh Cột
  // Thử thách: Độ khó tăng vọt! Gai cắm ngay trên đỉnh các cột bục hẹp (y=1, y=2),
  // bắt buộc phải căn lực nhảy cực chuẩn, không được nhảy quá trớn.
  // =========================================================================
  {
    id: 'cant_let_go',
    name: "Can't Let Go",
    vietnameseTitle: 'Bục Nhảy Tử Thần',
    difficulty: 'Hard',
    stars: 6,
    bpm: 148,
    trackLength: 380,
    baseSpeed: 13.0,
    songArtist: 'DJVI',
    songTrackName: "Can't Let Go",
    primaryColor: '#ec4899',
    secondaryColor: '#f43f5e',
    floorColor: '#831843',
    bgGradient: ['#500724', '#18181b'],
    description: 'Thử thách bục nhảy hẹp: Gai cắm ngay trên đỉnh cột và bục nhảy chỉ rộng 1-2 ô, đòi hỏi độ chính xác tuyệt đối từng mili-giây.',
    obstacles: [
      { id: 501, type: 'spike', x: 24, y: 0 },
      // Elevated spike on pillar!
      { id: 502, type: 'block', x: 36, y: 0, width: 2.5, height: 1 },
      { id: 503, type: 'spike', x: 41, y: 0 },
      { id: 504, type: 'block', x: 46, y: 0, width: 2, height: 2 },
      { id: 505, type: 'spike', x: 46, y: 2 }, // Spike on top of pillar!
      { id: 506, type: 'orb_yellow', x: 46, y: 3.8 }, // Jump over elevated spike!
      { id: 507, type: 'block', x: 55, y: 0, width: 3, height: 1 },
      { id: 508, type: 'coin', x: 55, y: 4 }, // Coin 1

      // Black Platforming Gauntlet
      { id: 509, type: 'spike', x: 68, y: 0 },
      { id: 510, type: 'block', x: 74, y: 0, width: 2, height: 2 },
      { id: 511, type: 'pad_pink', x: 74, y: 2 },
      { id: 512, type: 'block', x: 82, y: 3.5, width: 2, height: 1 },
      { id: 513, type: 'coin', x: 83, y: 6 }, // Coin 2
      { id: 514, type: 'spike', x: 92, y: 0 },

      // Narrow Ship Corridors (Staggered Teeth)
      { id: 515, type: 'portal_ship', x: 110, y: 0 },
      { id: 516, type: 'block', x: 130, y: 0, width: 2, height: 3 },
      { id: 517, type: 'block', x: 148, y: 6, width: 2, height: 4 },
      { id: 518, type: 'block', x: 166, y: 0, width: 2, height: 3 },
      { id: 519, type: 'coin', x: 176, y: 4 }, // Coin 3
      { id: 520, type: 'block', x: 184, y: 6, width: 2, height: 4 },

      // Climax: Stepping stone pillars over continuous spikes
      { id: 521, type: 'portal_cube', x: 205, y: 0 },
      { id: 522, type: 'spike', x: 220, y: 0 },
      { id: 523, type: 'block', x: 226, y: 0, width: 2, height: 1 },
      { id: 524, type: 'spike', x: 232, y: 0 },
      { id: 525, type: 'block', x: 238, y: 0, width: 2, height: 2 },
      { id: 526, type: 'orb_yellow', x: 248, y: 3.2 },
      { id: 527, type: 'block', x: 256, y: 2, width: 2, height: 1 },
      { id: 528, type: 'spike', x: 268, y: 0 },
    ],
  },

  // =========================================================================
  // 7. JUMPER (Hard ★7) - Chủ đề: Nhịp Bật Nhấp Nhô Sàn - Trần
  // Thử thách: Đan xen cổng đảo trọng lực và chuỗi đệm nảy liên hồi.
  // Người chơi vừa bay lên trần thì gặp ngay vòng kéo ngược về sàn.
  // =========================================================================
  {
    id: 'jumper',
    name: 'Jumper',
    vietnameseTitle: 'Nhịp Bật Nhấp Nhô',
    difficulty: 'Hard',
    stars: 7,
    bpm: 150,
    trackLength: 390,
    baseSpeed: 13.3,
    songArtist: 'Waterflame',
    songTrackName: 'Jumper',
    primaryColor: '#eab308',
    secondaryColor: '#10b981',
    floorColor: '#713f12',
    bgGradient: ['#422006', '#065f46'],
    description: 'Thử thách nhịp nảy kép: Vừa lộn lên trần nhà đã gặp ngay vòng kéo ngược về sàn, đổi chiều liên tục không ngừng nghỉ.',
    obstacles: [
      { id: 601, type: 'spike', x: 24, y: 0 },
      { id: 602, type: 'pad_yellow', x: 36, y: 0 },
      { id: 603, type: 'block', x: 42, y: 2.5, width: 3, height: 1 },
      { id: 604, type: 'coin', x: 43, y: 5.5 }, // Coin 1

      // Flip Up -> Bounce -> Flip Down sequence
      { id: 605, type: 'portal_gravity_up', x: 56, y: 0 },
      { id: 606, type: 'spike_ceiling', x: 72, y: 9.5 },
      { id: 607, type: 'orb_yellow', x: 84, y: 7.5 },
      { id: 608, type: 'portal_gravity_down', x: 98, y: 6.8 },
      { id: 609, type: 'spike', x: 108, y: 0 },
      { id: 610, type: 'pad_pink', x: 116, y: 0 },
      { id: 611, type: 'coin', x: 120, y: 5 }, // Coin 2

      // Wave-motion Maneuvering Ship
      { id: 612, type: 'portal_ship', x: 135, y: 0 },
      { id: 613, type: 'block', x: 155, y: 0, width: 2, height: 3 },
      { id: 614, type: 'block', x: 172, y: 6.5, width: 2, height: 4 },
      { id: 615, type: 'block', x: 190, y: 0, width: 2, height: 3 },
      { id: 616, type: 'coin', x: 200, y: 5 }, // Coin 3
      { id: 617, type: 'block', x: 208, y: 6.5, width: 2, height: 4 },

      // Bouncy Floor Finale
      { id: 618, type: 'portal_cube', x: 228, y: 0 },
      { id: 619, type: 'pad_yellow', x: 242, y: 0 },
      { id: 620, type: 'orb_pink', x: 252, y: 3.5 },
      { id: 621, type: 'block', x: 260, y: 2.5, width: 4, height: 1 },
      { id: 622, type: 'spike', x: 274, y: 0 },
      { id: 623, type: 'pad_yellow', x: 284, y: 0 },
      { id: 624, type: 'block', x: 290, y: 3, width: 4, height: 1 },
    ],
  },

  // =========================================================================
  // 8. TIME MACHINE (Harder ★8) - Chủ đề: Bẫy Tam Nấc & Phi Thuyền Zíc-Zắc
  // Thử thách: Ba đệm nhảy liên hoàn (Triple Pads) đưa người chơi vút lên độ
  // cao cực đại, sau đó là đoạn phi thuyền lượn dốc vượt rào cản so le.
  // =========================================================================
  {
    id: 'time_machine',
    name: 'Time Machine',
    vietnameseTitle: 'Bẫy Tam Nấc & Lượn Dốc',
    difficulty: 'Harder',
    stars: 8,
    bpm: 153,
    trackLength: 410,
    baseSpeed: 13.6,
    songArtist: 'Waterflame',
    songTrackName: 'Time Machine',
    primaryColor: '#06b6d4',
    secondaryColor: '#8b5cf6',
    floorColor: '#164e63',
    bgGradient: ['#083344', '#312e81'],
    description: 'Thử thách bẫy tam nấc: Ba bàn đạp nảy liên hoàn đưa lên độ cao ngất ngưởng, kết hợp phi thuyền dốc đứng vượt rào chắn so le.',
    obstacles: [
      { id: 701, type: 'spike', x: 24, y: 0 },
      // TRIPLE PAD CASCADE: Step 1 -> Step 2 -> Step 3
      { id: 702, type: 'pad_yellow', x: 36, y: 0 },
      { id: 703, type: 'block', x: 41, y: 0, width: 3, height: 2 },
      { id: 704, type: 'pad_yellow', x: 42.5, y: 2 }, // Pad 2 on step (y=2)!
      { id: 705, type: 'block', x: 49, y: 0, width: 3, height: 4 },
      { id: 706, type: 'pad_pink', x: 50.5, y: 4 }, // Pad 3 on high roof (y=4)!
      { id: 707, type: 'coin', x: 55, y: 7.5 }, // Coin 1 high in sky
      { id: 727, type: 'portal_teleport', x: 64, y: 0, targetX: 69, targetY: 6.0 },
      { id: 708, type: 'spike', x: 74, y: 0 },

      // Staircase Drop
      { id: 709, type: 'block', x: 84, y: 0, width: 2, height: 3 },
      { id: 710, type: 'block', x: 92, y: 0, width: 2, height: 2 },
      { id: 711, type: 'block', x: 100, y: 0, width: 2, height: 1 },
      { id: 712, type: 'coin', x: 101, y: 4 }, // Coin 2

      // Slalom Ship: Steep diagonals with 2x speed
      { id: 725, type: 'portal_speed_2x', x: 114, y: 0 },
      { id: 713, type: 'portal_ship', x: 120, y: 0 },
      { id: 714, type: 'block', x: 140, y: 0, width: 3, height: 3.5 },
      { id: 715, type: 'block', x: 160, y: 5.5, width: 3, height: 5 },
      { id: 716, type: 'coin', x: 172, y: 3.5 }, // Coin 3
      { id: 717, type: 'block', x: 180, y: 0, width: 3, height: 3.5 },
      { id: 718, type: 'block', x: 200, y: 5.5, width: 3, height: 5 },

      // High Altitude Cube Finish
      { id: 726, type: 'portal_speed_1x', x: 220, y: 0 },
      { id: 719, type: 'portal_cube', x: 225, y: 0 },
      { id: 720, type: 'pad_yellow', x: 240, y: 0 },
      { id: 721, type: 'orb_yellow', x: 252, y: 3.5 },
      { id: 722, type: 'block', x: 262, y: 3, width: 3, height: 1 },
      { id: 723, type: 'spike', x: 276, y: 0 },
      { id: 724, type: 'pad_yellow', x: 288, y: 0 },
    ],
  },

  // =========================================================================
  // 9. CYCLES (Harder ★9) - Chủ đề: Đại Chiến Lăn Bóng (Ball Mode Mastery)
  // Thử thách: 70% thời lượng màn là LĂN BÓNG (Ball Mode)!
  // Nhấp chuột để đảo trọng lực giữa sàn và trần qua các khe gai so le.
  // =========================================================================
  {
    id: 'cycles',
    name: 'Cycles',
    vietnameseTitle: 'Đại Chiến Lăn Bóng',
    difficulty: 'Harder',
    stars: 9,
    bpm: 156,
    trackLength: 420,
    baseSpeed: 14.0,
    songArtist: 'DJVI',
    songTrackName: 'Cycles',
    primaryColor: '#6366f1',
    secondaryColor: '#ec4899',
    floorColor: '#312e81',
    bgGradient: ['#1e1b4b', '#4c1d95'],
    description: 'Thử thách lăn bóng: Lăn siêu tốc và nhấp phím đảo trọng lực liên tục qua các rãnh chông so le sàn và trần cực gắt.',
    obstacles: [
      { id: 801, type: 'spike', x: 24, y: 0 },
      { id: 802, type: 'block', x: 36, y: 0, width: 3, height: 1 },
      { id: 803, type: 'coin', x: 37, y: 4 }, // Coin 1

      // === BALL MAZE 1: Alternating Floor / Ceiling Spikes ===
      { id: 804, type: 'portal_ball', x: 52, y: 0 },
      // Spike on floor -> click to flip to ceiling!
      { id: 805, type: 'spike', x: 68, y: 0 },
      // Spike on ceiling -> click to flip back down!
      { id: 806, type: 'spike_ceiling', x: 84, y: 9.5 },
      // Spike on floor again!
      { id: 807, type: 'spike', x: 100, y: 0 },
      { id: 808, type: 'coin', x: 108, y: 5 }, // Coin 2 (caught during flip)
      { id: 809, type: 'spike_ceiling', x: 116, y: 9.5 },
      { id: 810, type: 'spike', x: 132, y: 0 },
      { id: 811, type: 'spike_ceiling', x: 148, y: 9.5 },

      // High-speed Intermission Ship
      { id: 812, type: 'portal_ship', x: 168, y: 0 },
      { id: 813, type: 'block', x: 188, y: 0, width: 2, height: 2.5 },
      { id: 814, type: 'block', x: 206, y: 6.5, width: 2, height: 4 },
      { id: 815, type: 'coin', x: 218, y: 4 }, // Coin 3

      // === BALL MAZE 2: Floating Step Switches ===
      { id: 816, type: 'portal_ball', x: 235, y: 0 },
      { id: 817, type: 'block', x: 252, y: 0, width: 4, height: 1.5 },
      { id: 818, type: 'spike_ceiling', x: 268, y: 9.5 },
      { id: 819, type: 'block', x: 280, y: 7.5, width: 4, height: 1.5 }, // Ceiling landing
      { id: 820, type: 'spike', x: 296, y: 0 },
      { id: 821, type: 'spike_ceiling', x: 312, y: 9.5 },

      // Cube Finish
      { id: 822, type: 'portal_cube', x: 332, y: 0 },
      { id: 823, type: 'pad_yellow', x: 346, y: 0 },
      { id: 824, type: 'block', x: 352, y: 2.5, width: 4, height: 1 },
      { id: 825, type: 'spike', x: 366, y: 0 },
    ],
  },

  // =========================================================================
  // 10. XSTEP (Insane ★10) - Chủ đề: Vòng Xoáy Không Gian (Blue Ring & Pad Chaos)
  // Thử thách: Tốc độ cao! Giới thiệu Đệm xanh (Blue Pad) và Vòng xanh (Blue Orb)
  // đảo trọng lực ngay giữa không trung mà không cần cổng portal.
  // =========================================================================
  {
    id: 'xstep',
    name: 'xStep',
    vietnameseTitle: 'Vòng Xoáy Không Gian',
    difficulty: 'Insane',
    stars: 10,
    bpm: 158,
    trackLength: 430,
    baseSpeed: 14.3,
    songArtist: 'DJVI',
    songTrackName: 'xStep',
    primaryColor: '#3b82f6',
    secondaryColor: '#f97316',
    floorColor: '#1e3a8a',
    bgGradient: ['#172554', '#1e40af'],
    description: 'Thử thách đảo chiều chớp nhoáng: Đệm nảy xanh và vòng nhảy xanh lật ngược trọng lực tức thì giữa không trung.',
    obstacles: [
      { id: 901, type: 'spike', x: 24, y: 0 },
      // Blue Pad launch (instantly flings to ceiling!)
      { id: 902, type: 'pad_blue', x: 36, y: 0 },
      { id: 903, type: 'spike_ceiling', x: 50, y: 9.5 },
      // Blue Orb mid-air (instantly flings back to floor!)
      { id: 904, type: 'orb_blue', x: 62, y: 7.0 },
      { id: 905, type: 'spike', x: 74, y: 0 },
      { id: 906, type: 'coin', x: 76, y: 5 }, // Coin 1 (grabbed mid-fall)

      // Double Blue Ring Acrobatics
      { id: 907, type: 'pad_blue', x: 88, y: 0 },
      { id: 908, type: 'spike_ceiling', x: 102, y: 9.5 },
      { id: 909, type: 'orb_blue', x: 114, y: 6.8 },
      { id: 910, type: 'block', x: 126, y: 0, width: 4, height: 1.5 },
      { id: 911, type: 'coin', x: 128, y: 4.5 }, // Coin 2

      // High-speed Ball Gauntlet via Teleport & 2x Speed
      { id: 927, type: 'portal_teleport', x: 136, y: 0, targetX: 140, targetY: 5.0 },
      { id: 928, type: 'portal_speed_2x', x: 142, y: 0 },
      { id: 912, type: 'portal_ball', x: 145, y: 0 },
      { id: 913, type: 'spike', x: 162, y: 0 },
      { id: 914, type: 'spike_ceiling', x: 176, y: 9.5 },
      { id: 915, type: 'spike', x: 190, y: 0 },
      { id: 916, type: 'spike_ceiling', x: 204, y: 9.5 },
      { id: 917, type: 'coin', x: 214, y: 5 }, // Coin 3

      // Ship Flyway
      { id: 918, type: 'portal_ship', x: 230, y: 0 },
      { id: 919, type: 'block', x: 250, y: 0, width: 2, height: 3 },
      { id: 920, type: 'block', x: 268, y: 6.5, width: 2, height: 4 },

      // Cube Climax with Blue Orbs
      { id: 929, type: 'portal_speed_1x', x: 285, y: 0 },
      { id: 921, type: 'portal_cube', x: 290, y: 0 },
      { id: 922, type: 'pad_blue', x: 306, y: 0 },
      { id: 923, type: 'orb_blue', x: 320, y: 7.0 },
      { id: 924, type: 'pad_yellow', x: 334, y: 0 },
      { id: 925, type: 'block', x: 340, y: 3, width: 4, height: 1 },
      { id: 926, type: 'spike', x: 354, y: 0 },
    ],
  },

  // =========================================================================
  // 11. CLUTTERFUNK (Insane ★11) - Chủ đề: Rừng Chông Gai & Bục Nhảy Vi Mô
  // Thử thách: Địa hình dày đặc cột gai và trần thấp, chỉ chừa đúng 1-block
  // để đáp chân. Cần nhảy ngắn (short-hop) né đập trần.
  // =========================================================================
  {
    id: 'clutterfunk',
    name: 'Clutterfunk',
    vietnameseTitle: 'Rừng Chông Gai Tử Thần',
    difficulty: 'Insane',
    stars: 11,
    bpm: 161,
    trackLength: 440,
    baseSpeed: 14.6,
    songArtist: 'Waterflame',
    songTrackName: 'Clutterfunk',
    primaryColor: '#10b981',
    secondaryColor: '#f43f5e',
    floorColor: '#064e3b',
    bgGradient: ['#022c22', '#14532d'],
    description: 'Thử thách rừng chông: Cột gai san sát nhau, trần nhà thấp đòi hỏi những cú nhấp nhảy vi mô (Micro-hops) không đập đầu.',
    obstacles: [
      { id: 1001, type: 'spike', x: 24, y: 0 },
      // Micro-stepping stones: 1-unit blocks only!
      { id: 1002, type: 'block', x: 34, y: 0, width: 1.5, height: 1 },
      { id: 1003, type: 'spike', x: 38, y: 0 },
      { id: 1004, type: 'block', x: 42, y: 0, width: 1.5, height: 2 },
      { id: 1005, type: 'spike', x: 46, y: 0 },
      { id: 1006, type: 'block', x: 50, y: 0, width: 1.5, height: 3 },
      { id: 1007, type: 'coin', x: 51, y: 5.5 }, // Coin 1 on high peak
      { id: 1008, type: 'spike', x: 58, y: 0 },

      // Mini Mode into Low ceiling hazard (forces short hops!)
      { id: 1030, type: 'portal_mini', x: 64, y: 0 },
      { id: 1009, type: 'block', x: 68, y: 4.5, width: 16, height: 2 }, // Low ceiling!
      { id: 1010, type: 'orb_pink', x: 74, y: 1.5 }, // Pink micro orb under ceiling
      { id: 1011, type: 'orb_pink', x: 80, y: 1.5 },
      { id: 1012, type: 'coin', x: 86, y: 2.2 }, // Coin 2
      { id: 1031, type: 'portal_normal', x: 96, y: 0 },

      // Tight Wave Zigzag
      { id: 1013, type: 'portal_wave', x: 102, y: 0 },
      { id: 1014, type: 'block', x: 122, y: 0, width: 2, height: 2.5 },
      { id: 1015, type: 'block', x: 138, y: 6.5, width: 2, height: 4 },
      { id: 1016, type: 'block', x: 154, y: 0, width: 2, height: 2.5 },
      { id: 1017, type: 'coin', x: 166, y: 4.5 }, // Coin 3

      // Dense Ball Chicane
      { id: 1018, type: 'portal_ball', x: 185, y: 0 },
      { id: 1019, type: 'spike', x: 202, y: 0 },
      { id: 1020, type: 'spike_ceiling', x: 216, y: 9.5 },
      { id: 1021, type: 'spike', x: 230, y: 0 },
      { id: 1022, type: 'spike_ceiling', x: 244, y: 9.5 },

      // Micro-Jump Climax Cube
      { id: 1023, type: 'portal_cube', x: 265, y: 0 },
      { id: 1024, type: 'block', x: 280, y: 0, width: 1.5, height: 1.5 },
      { id: 1025, type: 'orb_yellow', x: 290, y: 2.5 },
      { id: 1026, type: 'block', x: 300, y: 0, width: 1.5, height: 2 },
      { id: 1027, type: 'pad_yellow', x: 312, y: 0 },
      { id: 1028, type: 'block', x: 318, y: 3, width: 3, height: 1 },
      { id: 1029, type: 'spike', x: 330, y: 0 },
    ],
  },

  // =========================================================================
  // 12. THEORY OF EVERYTHING (Insane ★12) - Chủ đề: Phi Đội Đĩa Bay UFO
  // Thử thách: 60% màn là ĐĨA BAY UFO! Nhấp nhả từng nhịp vỗ cánh (Flappy)
  // lượn qua các khe laser và cổng hẹp với độ chính xác cao.
  // =========================================================================
  {
    id: 'theory_of_everything',
    name: 'Theory of Everything',
    vietnameseTitle: 'Phi Đội Đĩa Bay UFO',
    difficulty: 'Insane',
    stars: 12,
    bpm: 163,
    trackLength: 450,
    baseSpeed: 14.9,
    songArtist: 'DJ-Nate',
    songTrackName: 'Theory of Everything',
    primaryColor: '#f59e0b',
    secondaryColor: '#ec4899',
    floorColor: '#78350f',
    bgGradient: ['#451a03', '#831843'],
    description: 'Thử thách đĩa bay: Làm chủ cơ chế UFO vỗ cánh từng nhịp nhả lướt qua mê cung cửa hẹp và chướng ngại vật nổi.',
    obstacles: [
      { id: 1101, type: 'spike', x: 24, y: 0 },
      { id: 1102, type: 'orb_yellow', x: 36, y: 1.8 },
      { id: 1103, type: 'coin', x: 48, y: 5 }, // Coin 1

      // === UFO GAUNTLET 1: Flap through multi-height gate slots ===
      { id: 1104, type: 'portal_ufo', x: 62, y: 0 },
      // Gate 1: High slot (tap 2-3 times to climb)
      { id: 1105, type: 'block', x: 80, y: 0, width: 2, height: 4 },
      // Gate 2: Low slot (let sink then tap once)
      { id: 1106, type: 'block', x: 98, y: 5.5, width: 2, height: 5 },
      { id: 1107, type: 'coin', x: 110, y: 4.5 }, // Coin 2 (in UFO tunnel)
      // Gate 3: Mid slot
      { id: 1108, type: 'block', x: 120, y: 0, width: 2, height: 2.5 },
      { id: 1109, type: 'block', x: 120, y: 7.5, width: 2, height: 3 },
      // Gate 4: High slot again
      { id: 1110, type: 'block', x: 140, y: 0, width: 2, height: 4.5 },

      // Fast Mini Wave Interlude
      { id: 1126, type: 'portal_mini', x: 158, y: 0 },
      { id: 1111, type: 'portal_wave', x: 162, y: 0 },
      { id: 1112, type: 'block', x: 182, y: 0, width: 2, height: 2 },
      { id: 1113, type: 'block', x: 198, y: 7, width: 2, height: 3.5 },
      { id: 1114, type: 'coin', x: 210, y: 4.5 }, // Coin 3

      // === UFO GAUNTLET 2: UFO + Inverted Ceiling Spikes! ===
      { id: 1127, type: 'portal_normal', x: 224, y: 0 },
      { id: 1115, type: 'portal_ufo', x: 230, y: 0 },
      { id: 1116, type: 'spike_ceiling', x: 248, y: 9.5 },
      { id: 1117, type: 'block', x: 260, y: 0, width: 2, height: 3 },
      { id: 1118, type: 'spike_ceiling', x: 274, y: 9.5 },
      { id: 1119, type: 'block', x: 286, y: 0, width: 2, height: 3 },

      // Climax Cube
      { id: 1120, type: 'portal_cube', x: 308, y: 0 },
      { id: 1121, type: 'spike', x: 324, y: 0 },
      { id: 1122, type: 'orb_yellow', x: 336, y: 1.8 },
      { id: 1123, type: 'pad_yellow', x: 348, y: 0 },
      { id: 1124, type: 'block', x: 352, y: 2.5, width: 4, height: 1 },
      { id: 1125, type: 'spike', x: 366, y: 0 },
    ],
  },

  // =========================================================================
  // 13. CLUBSTEP (Demon ★13) - Chủ đề: Hàm Răng Quái Vật Ác Quỷ
  // Thử thách: Độ khó DEMON thực thụ! Cấu trúc hàm răng quỷ khổng lồ
  // bao quanh hầm phi thuyền chỉ rộng 3.2 ô, đòi hỏi vi chỉnh lực đẩy cực chuẩn.
  // =========================================================================
  {
    id: 'clubstep',
    name: 'Clubstep',
    vietnameseTitle: 'Hàm Răng Quái Vật Ác Quỷ',
    difficulty: 'Demon',
    stars: 13,
    bpm: 166,
    trackLength: 470,
    baseSpeed: 15.3,
    songArtist: 'DJ-Nate',
    songTrackName: 'Clubstep',
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    floorColor: '#450a0a',
    bgGradient: ['#18181b', '#7f1d1d'],
    description: 'Thử thách Ác Quỷ (Demon): Hàm răng quái vật nuốt chửng màn hình và đường bay phi thuyền hẹp chỉ 3 ô đầy gai nhọn.',
    obstacles: [
      { id: 1201, type: 'spike', x: 24, y: 0 },
      { id: 1202, type: 'block', x: 36, y: 0, width: 2, height: 2 },
      { id: 1203, type: 'orb_yellow', x: 44, y: 2.8 },
      { id: 1204, type: 'coin', x: 45, y: 5 }, // Coin 1

      // === THE DEMON JAW SHIP: Narrow 3.2-unit passage with Mini Mode ===
      { id: 1230, type: 'portal_mini', x: 56, y: 0 },
      { id: 1205, type: 'portal_ship', x: 60, y: 0 },
      // Monster Mouth 1
      { id: 1206, type: 'block', x: 80, y: 0, width: 3, height: 2.2 },
      { id: 1207, type: 'spike', x: 81, y: 2.2 }, // Bottom teeth (tip at 3.2)
      { id: 1208, type: 'block', x: 80, y: 7.5, width: 3, height: 3.0 },
      { id: 1209, type: 'spike_ceiling', x: 81, y: 6.5 }, // Top teeth (hanging to 6.5)

      // Monster Mouth 2 (Staggered dip)
      { id: 1210, type: 'block', x: 104, y: 0, width: 3, height: 1.8 },
      { id: 1211, type: 'block', x: 104, y: 6.2, width: 3, height: 4.3 },
      { id: 1212, type: 'coin', x: 116, y: 4 }, // Coin 2 inside monster throat

      // Monster Mouth 3 (High rise)
      { id: 1213, type: 'block', x: 128, y: 0, width: 3, height: 3.2 },
      { id: 1214, type: 'block', x: 128, y: 7.8, width: 3, height: 2.7 },

      // Demon Ball Section
      { id: 1231, type: 'portal_normal', x: 150, y: 0 },
      { id: 1215, type: 'portal_ball', x: 155, y: 0 },
      { id: 1216, type: 'spike', x: 172, y: 0 },
      { id: 1217, type: 'spike_ceiling', x: 186, y: 9.5 },
      { id: 1218, type: 'coin', x: 196, y: 5 }, // Coin 3
      { id: 1219, type: 'spike', x: 206, y: 0 },

      // Demon UFO Section
      { id: 1220, type: 'portal_ufo', x: 228, y: 0 },
      { id: 1221, type: 'block', x: 246, y: 0, width: 2, height: 3 },
      { id: 1222, type: 'block', x: 262, y: 6.5, width: 2, height: 4 },

      // Intense Demon Climax at 2x Speed
      { id: 1232, type: 'portal_speed_2x', x: 280, y: 0 },
      { id: 1223, type: 'portal_cube', x: 285, y: 0 },
      { id: 1224, type: 'spike', x: 300, y: 0 },
      { id: 1225, type: 'orb_yellow', x: 312, y: 2.0 },
      { id: 1226, type: 'spike', x: 312, y: 0 },
      { id: 1227, type: 'pad_yellow', x: 324, y: 0 },
      { id: 1228, type: 'block', x: 328, y: 2.5, width: 4, height: 1 },
      { id: 1229, type: 'spike', x: 342, y: 0 },
    ],
  },

  // =========================================================================
  // 14. DEADLOCKED (Extreme Demon ★14) - Chủ đề: Cơn Bão Sóng Điện Tối Thượng
  // Thử thách: Đỉnh cao SIÊU ÁC QUỶ! Tốc độ 15.6x. Chuyên sâu SÓNG LÔI ĐIỆN (Wave)
  // bay zíc-zắc 45 độ qua khe hẹp kim cương, phối hợp UFO & Demon Ship bùng nổ.
  // =========================================================================
  {
    id: 'deadlocked',
    name: 'Deadlocked',
    vietnameseTitle: 'Cơn Bão Sóng Điện Tối Thượng',
    difficulty: 'Extreme Demon',
    stars: 14,
    bpm: 170,
    trackLength: 500,
    baseSpeed: 15.6,
    songArtist: 'F-777',
    songTrackName: 'Deadlocked',
    primaryColor: '#ef4444',
    secondaryColor: '#f59e0b',
    floorColor: '#450a0a',
    bgGradient: ['#3b0764', '#7f1d1d'],
    description: 'Thử thách Siêu Ác Quỷ (Extreme Demon): Sóng lôi điện (Wave) zíc-zắc 45° tốc độ bàn thờ qua khe hẹp kim cương đầy kịch tính.',
    obstacles: [
      { id: 1301, type: 'spike', x: 24, y: 0 },
      { id: 1302, type: 'orb_yellow', x: 36, y: 1.8 },
      { id: 1303, type: 'spike', x: 36, y: 0 },
      { id: 1304, type: 'pad_yellow', x: 48, y: 0 },
      { id: 1305, type: 'coin', x: 52, y: 6 }, // Coin 1

      // === EXTREME WAVE GAUNTLET 1 (Zigzag 45° Diamond Corridors at 2x) ===
      { id: 1331, type: 'portal_speed_2x', x: 64, y: 0 },
      { id: 1306, type: 'portal_wave', x: 68, y: 0 },
      // Slant 1: Bottom obstacle -> must hold to climb 45°
      { id: 1307, type: 'block', x: 86, y: 0, width: 3, height: 2.5 },
      // Slant 2: Top ceiling obstacle -> must release to dive 45°
      { id: 1308, type: 'block', x: 104, y: 7.0, width: 3, height: 3.5 },
      { id: 1309, type: 'coin', x: 116, y: 4.5 }, // Coin 2 inside wave zigzag
      // Slant 3: Rapid rise
      { id: 1310, type: 'block', x: 124, y: 0, width: 3, height: 2.5 },
      // Slant 4: Rapid dive
      { id: 1311, type: 'block', x: 142, y: 7.0, width: 3, height: 3.5 },

      // Teleport into High-Velocity Spastic UFO
      { id: 1332, type: 'portal_teleport', x: 156, y: 0, targetX: 160, targetY: 5.0 },
      { id: 1312, type: 'portal_ufo', x: 165, y: 0 },
      { id: 1313, type: 'block', x: 184, y: 0, width: 2, height: 3 },
      { id: 1314, type: 'block', x: 200, y: 6.5, width: 2, height: 4 },
      { id: 1315, type: 'coin', x: 212, y: 4.5 }, // Coin 3

      // Tight Mini Demon Ship
      { id: 1333, type: 'portal_mini', x: 226, y: 0 },
      { id: 1316, type: 'portal_ship', x: 232, y: 0 },
      { id: 1317, type: 'block', x: 252, y: 0, width: 2, height: 3 },
      { id: 1318, type: 'block', x: 270, y: 6.5, width: 2, height: 4 },

      // === FINAL WAVE CLIMAX (3x Speed Drop of F-777 Deadlocked) ===
      { id: 1334, type: 'portal_normal', x: 288, y: 0 },
      { id: 1335, type: 'portal_speed_3x', x: 291, y: 0 },
      { id: 1319, type: 'portal_wave', x: 295, y: 0 },
      { id: 1320, type: 'block', x: 314, y: 0, width: 2, height: 2.5 },
      { id: 1321, type: 'block', x: 328, y: 7.0, width: 2, height: 3.5 },
      { id: 1322, type: 'block', x: 342, y: 0, width: 2, height: 2.5 },
      { id: 1323, type: 'block', x: 356, y: 7.0, width: 2, height: 3.5 },

      // Grand Climax Cube
      { id: 1336, type: 'portal_speed_2x', x: 376, y: 0 },
      { id: 1324, type: 'portal_cube', x: 380, y: 0 },
      { id: 1325, type: 'spike', x: 396, y: 0 },
      { id: 1326, type: 'orb_yellow', x: 408, y: 2.0 },
      { id: 1327, type: 'spike', x: 408, y: 0 },
      { id: 1328, type: 'pad_yellow', x: 420, y: 0 },
      { id: 1329, type: 'block', x: 424, y: 2.5, width: 4, height: 1 },
      { id: 1330, type: 'spike', x: 438, y: 0 },
    ],
  },
];
