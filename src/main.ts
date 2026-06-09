/**
 * Author: Musa Ali
 * Date: 3/4/2026
 *
 * Description: Game management — initializes map, player, and game loop
 * Please note if you ever see any ctx it is most likelu ai'ed unless its for
 * drawPlayer or drawMob
 */
import { drawTrisect, roomPattern, hallwayPattern } from "./game/map/drawTrisect.js";
import { StrongJacket } from "./game/items/Item.js";
import { Player } from "./game/player.js";
import type { Mob } from "./game/entities/mob.js";
import { drawHUD, drawClassSelect, setClassHover, getClassFromClick, drawControlsPanel } from "./game/ui/HUD.js";
import {
    unregisterAllRooms, getActiveRoomId, activateRoom, freezeRoom,
    saveRoomSnapshot, getRoomSnapshot,
    getRoomById, getRoomWorldBounds, isRoomCleared, clearSpawnedRoom,
    type DroppedItem, type RoomSnapshot,
} from "./game/map/roomRegistry.js";
import { boss } from "./game/entities/Boss.js";
import { Teacher1, Teacher2, Teacher3, type MiniBoss } from "./game/entities/MiniBosses.js";
import { spawnRoomMobs, respawnRoomMobs } from "./game/spawner.js";
import { WelcomeScreen } from "./game/ui/WelcomeScreen.js";
import { Inventory } from "./game/ui/Inventory.js";
import { GameOverScreen } from "./game/ui/GameOver.js";
import { PauseMenu } from "./game/ui/PauseMenu.js";

// Main canvas where everything gets drawn
export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
ctx.imageSmoothingEnabled = false; // Keep that pixel art crispy

// Separate canvas for the map so we don't redraw it every frame
const map = document.createElement("canvas");
const mapCtx = map.getContext("2d")!;
mapCtx.imageSmoothingEnabled = false;

// Core game entities
export const player = new Player(360, 720);
export const mobArray: Mob[] = []; // All the enemies running around
const miniBossArray: MiniBoss[] = []; // Those annoying teachers
let primaryBoss: boss | null = null; // The big bad principal

// Game state tracking stuff
let killCounter = 0;
let activeRoomId: number | null = null; // Which room is the player in right now
let previousRoomId: number | null = null;
let bossDefeated = false;
let floorClearedTimer = 0; // How long to show the victory screen
let transitionFlashTimer = 0; // That white flash when moving between rooms
let gameStarted = false;
let primaryBossDropProcessed = false; // So we don't drop the same loot twice
let pickupMessage = ""; // "You picked up a thing!" messages
let pickupMessageTimer = 0;
const deadMinibossRoomIds = new Set<number>(); // Remember which minibosses we killed

const TRISECT_TYPES: ["room", "hallway", "room"] = ["room", "hallway", "room"];

// All the different screens in our game
const welcomeScreen = new WelcomeScreen();
const inventory = new Inventory();
const gameOverScreen = new GameOverScreen();
const pauseMenu = new PauseMenu();

// Where the player starts each life
const floorStartX = 360;
const floorStartY = 720;

// Room-specific data that persists when you leave and come back
const roomDroppedItems = new Map<number, DroppedItem[]>(); // Items on the floor in each room
const roomRespawnTimers = new Map<number, number>(); // How long until mobs respawn

// Basic collision detection - checks if two rectangles are touching
function rectangularOverlapChecker(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// Sets up the whole dungeon layout
function buildMap() {
    // Clear everything first
    unregisterAllRooms();
    mobArray.length = 0;
    miniBossArray.length = 0;
    roomDroppedItems.clear();
    roomRespawnTimers.clear();

    // Build the first set of rooms - room, hallway, room
    const trisect1 = drawTrisect(
        mapCtx, 0, 720 / 2,
        roomPattern, undefined,
        hallwayPattern, undefined,
        roomPattern, undefined,
        TRISECT_TYPES
    );

    // Connect the second set right next to the first one
    const trisect1Room3 = getRoomById(trisect1.roomIds[2]);
    const trisect2X = trisect1Room3
        ? trisect1Room3.roomX + trisect1Room3.cols * 36 - 36 // Share a wall
        : 2052; // Fallback position
    const trisect2 = drawTrisect(
        mapCtx, trisect2X, 720 / 2,
        roomPattern, undefined,
        hallwayPattern, undefined,
        roomPattern, undefined,
        TRISECT_TYPES
    );

    // Place the minibosses in strategic locations
    const hallway1 = getRoomById(trisect1.roomIds[1]);
    const room3t1 = getRoomById(trisect1.roomIds[2]);
    const inkRoom = hallway1; // Ink teacher hangs out in the hallway
    const coachRoom = room3t1; // Coach is in the first end room
    const vpRoom = getRoomById(trisect2.roomIds[1]); // VP is in the second hallway

    // Only spawn minibosses if we haven't killed them yet
    if (inkRoom && !deadMinibossRoomIds.has(inkRoom.roomId)) {
        const mb = new Teacher1(inkRoom.roomX + 300, inkRoom.roomY + 300, inkRoom.roomId);
        miniBossArray.push(mb);
        inkRoom.miniboss = mb;
    }
    if (coachRoom && !deadMinibossRoomIds.has(coachRoom.roomId)) {
        const mb = new Teacher2(coachRoom.roomX + 300, coachRoom.roomY + 300, coachRoom.roomId);
        miniBossArray.push(mb);
        coachRoom.miniboss = mb;
    }
    if (vpRoom && !deadMinibossRoomIds.has(vpRoom.roomId)) {
        const mb = new Teacher3(vpRoom.roomX + 300, vpRoom.roomY + 300, vpRoom.roomId);
        miniBossArray.push(mb);
        vpRoom.miniboss = mb;
    }

    // The big boss always goes in the final room
    const bossRoom = getRoomById(trisect2.roomIds[2]);
    if (bossRoom) {
        primaryBoss = new boss(bossRoom.roomX + 300, bossRoom.roomY + 300, "boss", "Final Entity", bossRoom.roomId);
    }
}

// Check if player is standing in any dangerous paint zones
function updatePaintZoneStatus() {
    player.inPaintZone = false;
    const px = player.x + player.playerSize / 2;
    const py = player.y + player.playerSize / 2;

    // Go through all miniboss paint zones in the current room
    for (const mb of miniBossArray) {
        if (mb.homeRoomId !== activeRoomId || mb.isDead) continue;
        for (const zone of mb.paintZones) {
            const dx = px - zone.x;
            const dy = py - zone.y;
            // Simple circle collision check
            if (dx * dx + dy * dy < zone.radius * zone.radius) {
                player.inPaintZone = true;
                return;
            }
        }
    }
}

// Handle when player moves between rooms
function handleRoomTransition() {
    const newRoomId = getActiveRoomId(player.x, player.y, activeRoomId);

    if (newRoomId !== activeRoomId) {
        // Save the current room state so we can restore it later
        if (activeRoomId !== null) {
            const snapshot: RoomSnapshot = {
                mobs: mobArray.filter(m => m.homeRoomId === activeRoomId),
                minibossAlive: miniBossArray.some(mb => mb.homeRoomId === activeRoomId && !mb.isDead),
                minibossHealth: miniBossArray.find(mb => mb.homeRoomId === activeRoomId)?.health ?? 0,
                droppedItems: roomDroppedItems.get(activeRoomId) ?? [],
                defeatedBannerTimer: 0,
                respawnTimer: roomRespawnTimers.get(activeRoomId) ?? 0,
            };
            saveRoomSnapshot(activeRoomId, snapshot);
            freezeRoom(activeRoomId);
        }

        // Switch to the new room
        previousRoomId = activeRoomId;
        activeRoomId = newRoomId;
        transitionFlashTimer = 10; // That brief white flash effect

        if (activeRoomId !== null) {
            activateRoom(activeRoomId);

            // If we haven't been in this room before, spawn some mobs
            const snapshot = getRoomSnapshot(activeRoomId);
            if (!snapshot) {
                const room = getRoomById(activeRoomId);
                if (room) {
                    const bounds = getRoomWorldBounds(activeRoomId)!;
                    const newMobs = spawnRoomMobs(
                        activeRoomId, bounds.x, bounds.y, bounds.w, bounds.h,
                        player.level, room.roomType
                    );
                    mobArray.push(...newMobs);
                }
            }
        }
    }
}

// When a mob dies, give player XP and maybe some stats
function processMobDeaths() {
    for (let i = mobArray.length - 1; i >= 0; i--) {
        const mob = mobArray[i];
        if (!mob.isMobDead) continue;
        if (mob.homeRoomId !== activeRoomId) continue;

        killCounter++;
        const isHallway = mob.mobType === "Hall Monitor" || mob.mobType === "Teacher";
        if (isHallway) {
            player.increaseXP(200 + player.level * 20);
            // Random stat boost for hallway enemies
            const stats = ["mind", "body", "soul"] as const;
            const pick = stats[Math.floor(Math.random() * 3)];
            player[pick] += 1;
        } else {
            player.increaseXP(250 + player.level * 25);
        }
        mobArray.splice(i, 1); // Remove the dead mob
    }
}

// When a miniboss dies, drop some loot and give big XP
function processMinibossDeaths() {
    for (const mb of miniBossArray) {
        if (mb.isDead && !mb.dropProcessed) {
            mb.dropProcessed = true;
            deadMinibossRoomIds.add(mb.homeRoomId); // Remember we killed this one
            player.increaseXP(mb.xpReward);

            // Drop the loot where the boss died
            const item = mb.dropItem();
            const drops = roomDroppedItems.get(mb.homeRoomId) ?? [];
            drops.push({ item, x: mb.x + mb.bossSize / 2 - 15, y: mb.y + mb.bossSize / 2 - 15 });
            roomDroppedItems.set(mb.homeRoomId, drops);

            // Show a message about what dropped
            pickupMessage = item.name + " dropped!";
            pickupMessageTimer = 120;
            mb.onDeath();
        }
    }
}

// When the main boss dies, drop the final loot
function processPrimaryBossDeath() {
    if (!primaryBoss || !primaryBoss.isDead || primaryBossDropProcessed) return;

    primaryBossDropProcessed = true;
    player.increaseXP(1500); // Big XP reward

    // Drop the best item in the game
    const item = new StrongJacket();
    const drops = roomDroppedItems.get(primaryBoss.homeRoomId) ?? [];
    drops.push({
        item,
        x: primaryBoss.x + primaryBoss.bossSize / 2 - 15,
        y: primaryBoss.y + primaryBoss.bossSize / 2 - 15,
    });
    roomDroppedItems.set(primaryBoss.homeRoomId, drops);

    pickupMessage = item.name + " dropped!";
    pickupMessageTimer = 120;
}

// Let the player pick up items by walking over them
function pickupItems() {
    if (activeRoomId === null) return;
    const drops = roomDroppedItems.get(activeRoomId);
    if (!drops) return;

    for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i];
        // Check if player is touching the item
        if (rectangularOverlapChecker(player.x, player.y, player.playerSize, player.playerSize, drop.x, drop.y, 30, 30)) {
            if (inventory.addItem(drop.item)) {
                drops.splice(i, 1); // Remove from floor
                player.equipItem(drop.item);
                pickupMessage = "Picked up " + drop.item.name + "!";
                pickupMessageTimer = 90;
            }
        }
    }
}

// Respawn mobs in cleared rooms after a delay
function handleRoomRespawn() {
    if (bossDefeated || activeRoomId === null) return;

    if (isRoomCleared(activeRoomId, mobArray)) {
        const timer = roomRespawnTimers.get(activeRoomId) ?? 0;
        if (timer <= 0) {
            roomRespawnTimers.set(activeRoomId, 300); // Start 5 second timer
        } else {
            roomRespawnTimers.set(activeRoomId, timer - 1);
            if (timer - 1 <= 0) {
                // Time's up, respawn the mobs
                const room = getRoomById(activeRoomId);
                const bounds = getRoomWorldBounds(activeRoomId);
                if (room && bounds) {
                    clearSpawnedRoom(activeRoomId);
                    const newMobs = respawnRoomMobs(
                        activeRoomId, bounds.x, bounds.y, bounds.w, bounds.h,
                        player.level, room.roomType
                    );
                    mobArray.push(...newMobs);
                }
            }
        }
    } else {
        // Room isn't cleared, reset the timer
        roomRespawnTimers.set(activeRoomId, 0);
    }
}

// Reset player to starting position and optionally reset progress
function resetGame(fullReset: boolean) {
    // Always reset these
    player.x = floorStartX;
    player.y = floorStartY;
    player.health = player.maxHealth;
    player.stamina = player.maxStamina;
    player.isPlayerDead = false;
    mobArray.length = 0;
    bossDefeated = false;
    floorClearedTimer = 0;
    activeRoomId = null;
    primaryBossDropProcessed = false;

    if (fullReset) {
        // Complete restart - lose all progress
        killCounter = 0;
        deadMinibossRoomIds.clear();
        player.level = 0;
        player.xp = 0;
        player.xpToNextLevel = 100;
        player.classSelect = false;
        player.classChosen = false;
        player.playerClass = null;
        inventory.slots = new Array(7).fill(null);
    }
    buildMap(); // Rebuild the world
}

// Load saved game data if continuing
function loadSaveIfContinuing() {
    const raw = localStorage.getItem("wroc_save");
    if (!raw || !welcomeScreen.continuingFromSave) return;

    try {
        const data = JSON.parse(raw);
        if (data.level) player.level = data.level;
        if (data.xp) player.xp = data.xp;
        if (data.health) player.health = data.health;
        if (data.stamina) player.stamina = data.stamina;
        if (data.killCount) killCounter = data.killCount;
        player.xpToNextLevel = 100 * Math.pow(2, player.level); // Recalculate XP requirement
    } catch {
        // If save is corrupted, just ignore it
    }
}

// Save the current game state
function saveGame() {
    const saveData = {
        playerName: player.name,
        level: player.level,
        xp: player.xp,
        health: player.health,
        stamina: player.stamina,
        class: player.playerClass?.className ?? null,
        inventory: inventory.slots.map(s => s?.name ?? null),
        killCount: killCounter,
    };
    localStorage.setItem("wroc_save", JSON.stringify(saveData));
}

// Main game initialization
function onStart() {
    player.movementKeys(); // Set up WASD controls

    // Handle window resizing
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.imageSmoothingEnabled = false;
        map.width = 2160 * 3; // Big enough for our dungeon
        map.height = 2160 * 3;
        mapCtx.imageSmoothingEnabled = false;
        buildMap();
    }

    window.addEventListener("resize", resize);
    resize();

    // Show welcome screen first, then start the game
    function welcomeLoop() {
        if (!welcomeScreen.isComplete) {
            welcomeScreen.draw(ctx, canvas);
            window.requestAnimationFrame(welcomeLoop);
            return;
        }

        // Player finished welcome screen setup
        player.name = welcomeScreen.playerName || "Player";
        player.setColors(welcomeScreen.skinColor, welcomeScreen.clothesColor);
        loadSaveIfContinuing();
        gameStarted = true;
        window.requestAnimationFrame(gameLoop);
    }

    // Handle keyboard input
    window.addEventListener("keydown", e => {
        if (!gameStarted) {
            welcomeScreen.handleInput(e);
            return;
        }

        // Don't process game input if we're in a menu
        if (gameOverScreen.isShowing || pauseMenu.isOpen) return;

        if (e.key === "Escape") {
            // Toggle pause menu
            pauseMenu.isOpen = !pauseMenu.isOpen;
            return;
        }

        if (e.key === "e") {
            // Toggle inventory
            if (inventory.isOpen) inventory.close();
            else inventory.open();
            return;
        }

        if (player.classSelect) {
            // Player is choosing their class
            if (e.key === "1") player.selectClass("Language");
            else if (e.key === "2") player.selectClass("STEM");
            else if (e.key === "3") player.selectClass("Sports");
            else if (e.key === "4") player.selectClass("None");
            return;
        }

        if (e.key === "q" && !inventory.isOpen) {
            // Use special ability
            const allBosses = [...miniBossArray, ...(primaryBoss ? [primaryBoss] : [])];
            player.tryAbility(mobArray, allBosses);
        }
    });

    // Handle mouse clicks
    window.addEventListener("click", e => {
        if (!gameStarted) {
            welcomeScreen.handleClick(e, canvas);
            return;
        }

        if (gameOverScreen.isShowing) {
            const action = gameOverScreen.handleClick(e, canvas);
            if (action === "respawn") {
                gameOverScreen.hide();
                resetGame(false); // Just respawn, keep progress
            } else if (action === "menu") {
                gameOverScreen.hide();
                gameStarted = false;
                welcomeScreen.isComplete = false;
                window.requestAnimationFrame(welcomeLoop);
            }
            return;
        }

        if (pauseMenu.isOpen) {
            pauseMenu.handleClick(e, canvas, {
                onResume: () => { pauseMenu.isOpen = false; },
                onRestart: () => {
                    pauseMenu.isOpen = false;
                    gameStarted = false;
                    welcomeScreen.isComplete = false;
                    resetGame(true); // Full restart
                    window.requestAnimationFrame(welcomeLoop);
                },
                onSaveQuit: () => {
                    saveGame();
                    setTimeout(() => {
                        pauseMenu.isOpen = false;
                        gameStarted = false;
                        welcomeScreen.isComplete = false;
                        window.requestAnimationFrame(welcomeLoop);
                    }, 1500);
                },
            });
            return;
        }

        if (inventory.isOpen) {
            inventory.handleClick(e, canvas, player);
            return;
        }

        if (player.classSelect) {
            // Handle class selection clicks
            const rect = canvas.getBoundingClientRect();
            const choice = getClassFromClick(e.clientX - rect.left, e.clientY - rect.top, canvas);
            if (choice) player.selectClass(choice);
        }
    });

    // Handle mouse movement for class selection hover effects
    window.addEventListener("mousemove", e => {
        if (player.classSelect) {
            const rect = canvas.getBoundingClientRect();
            setClassHover(e.clientX - rect.left, e.clientY - rect.top, canvas);
        }
    });

    // Main game loop - this runs 60 times per second
    function gameLoop() {
        if (!gameStarted) return;

        // If paused, just draw the current state and pause menu
        if (pauseMenu.isOpen) {
            const camX = Math.round((canvas.width / 2) - player.x);
            const camY = Math.round((canvas.height / 2) - player.y);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(camX, camY);
            ctx.drawImage(map, 0, 0);
            player.draw(ctx);
            ctx.restore();
            pauseMenu.draw(ctx, canvas);
            window.requestAnimationFrame(gameLoop);
            return;
        }

        // Camera follows the player
        const camX = Math.round((canvas.width / 2) - player.x);
        const camY = Math.round((canvas.height / 2) - player.y);

        // Clear screen and draw the world
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(camX, camY); // Move everything relative to player
        ctx.drawImage(map, 0, 0);

        // Only update game logic if player is alive and not in inventory
        if (!player.isPlayerDead && !inventory.isOpen) {
            updatePaintZoneStatus();
            player.update();
            handleRoomTransition();
        }

        player.draw(ctx);

        // Process all mobs in the current room
        for (let i = mobArray.length - 1; i >= 0; i--) {
            const mob = mobArray[i];
            if (mob.homeRoomId !== activeRoomId) continue; // Skip mobs in other rooms

            if (mob.isMobDead) continue;

            mob.draw(ctx);
            if (!player.isPlayerDead && !inventory.isOpen) {
                mob.mobMovement(player);
                // Check if mob is touching player
                const isTouching = rectangularOverlapChecker(
                    player.x, player.y, player.playerSize, player.playerSize,
                    mob.mobX, mob.mobY, mob.mobSize, mob.mobSize
                );
                if (isTouching) {
                    // Attack with cooldown
                    const timeNow = performance.now();
                    if (timeNow - mob.lastAttackTime >= mob.attackCooldown) {
                        player.loseHP(mob);
                        mob.lastAttackTime = timeNow;
                    }
                }
                // Player attacks with R key
                if (player.keys.has("r") && isTouching) {
                    player.tryAttack(mob);
                }
            }
        }

        // Process minibosses in the current room
        for (const mb of miniBossArray) {
            if (mb.homeRoomId !== activeRoomId) continue;
            mb.draw(ctx);
            if (!mb.isDead && !player.isPlayerDead && !inventory.isOpen) {
                mb.bossMovement(player);
                mb.tryNormalAttack(player);
                if (player.keys.has("r")) {
                    const touching = rectangularOverlapChecker(
                        player.x, player.y, player.playerSize, player.playerSize,
                        mb.x, mb.y, mb.bossSize, mb.bossSize
                    );
                    if (touching) mb.loseHP(player);
                }
            }
        }

        // Process the main boss if in the same room
        if (primaryBoss && primaryBoss.homeRoomId === activeRoomId) {
            primaryBoss.draw(ctx);
            if (!primaryBoss.isDead && !player.isPlayerDead && !inventory.isOpen) {
                primaryBoss.bossMovement(player);
                primaryBoss.tryNormalAttack(player);
                if (player.keys.has("r")) {
                    const touching = rectangularOverlapChecker(
                        player.x, player.y, player.playerSize, player.playerSize,
                        primaryBoss.x, primaryBoss.y, primaryBoss.bossSize, primaryBoss.bossSize
                    );
                    if (touching) primaryBoss.loseHP(player);
                }
            }
            // Check for victory condition
            if (primaryBoss.isDead && !bossDefeated) {
                bossDefeated = true;
                floorClearedTimer = 180; // Show victory screen for 3 seconds
            }
        }

        // Draw items dropped on the floor with a nice pulsing effect
        const drops = activeRoomId !== null ? roomDroppedItems.get(activeRoomId) : undefined;
        if (drops) {
            const pulse = 0.5 + Math.sin(performance.now() / 200) * 0.3;
            for (const drop of drops) {
                // Draw a glowing circle around the item
                ctx.fillStyle = `rgba(255, 220, 80, ${pulse * 0.4})`;
                ctx.beginPath();
                ctx.arc(drop.x + 15, drop.y + 15, 22, 0, Math.PI * 2);
                ctx.fill();
                drop.item.draw(ctx, drop.x, drop.y, 30);
            }
        }

        // Process game events only when alive and not in menus
        if (!player.isPlayerDead && !inventory.isOpen) {
            processMobDeaths();
            processMinibossDeaths();
            processPrimaryBossDeath();
            pickupItems();
            handleRoomRespawn();
        }

        // Count down pickup message timer
        if (pickupMessageTimer > 0) pickupMessageTimer--;

        // Show game over screen when player dies
        if (player.isPlayerDead && !gameOverScreen.isShowing) {
            gameOverScreen.show();
        }

        ctx.restore(); // Stop translating for UI elements

        // Room transition flash effect
        if (transitionFlashTimer > 0) {
            const alpha = transitionFlashTimer > 8 ? (16 - transitionFlashTimer) / 8 : transitionFlashTimer / 8;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            transitionFlashTimer--;
        }

        // Add a subtle vignette for that retro feel
        const vig = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.height * 0.25,
            canvas.width / 2, canvas.height / 2, canvas.height * 0.75
        );
        vig.addColorStop(0, "rgba(0,0,0,0)");
        vig.addColorStop(1, "rgba(0,0,0,0.35)");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the HUD with player stats
        drawHUD(ctx, canvas, player, killCounter);

        // Show pickup messages
        if (pickupMessageTimer > 0 && pickupMessage) {
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(canvas.width / 2 - 140, canvas.height - 80, 280, 32);
            ctx.strokeStyle = "#f0c040";
            ctx.lineWidth = 1;
            ctx.strokeRect(canvas.width / 2 - 140, canvas.height - 80, 280, 32);
            ctx.fillStyle = "#f0c040";
            ctx.font = "bold 14px monospace";
            ctx.textAlign = "center";
            ctx.fillText(pickupMessage, canvas.width / 2, canvas.height - 58);
        }

        // Show controls when not in a menu
        if (!inventory.isOpen && !gameOverScreen.isShowing) {
            drawControlsPanel(ctx, canvas);
        }

        // Show class selection screen
        if (player.classSelect) {
            drawClassSelect(ctx, canvas);
        }

        // Show victory screen when boss is defeated
        if (bossDefeated && floorClearedTimer > 0) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "gold";
            ctx.font = "bold 36px Georgia, serif";
            ctx.textAlign = "center";
            ctx.fillText("Floor Cleared!", canvas.width / 2, canvas.height / 2);
            floorClearedTimer--;
            if (floorClearedTimer <= 0) {
                ctx.fillStyle = "white";
                ctx.font = "20px monospace";
                ctx.fillText("[ Next Floor — Coming Soon ]", canvas.width / 2, canvas.height / 2 + 50);
            }
        }

        // Draw UI elements on top of everything
        if (inventory.isOpen) {
            inventory.draw(ctx, canvas, player);
        }

        if (gameOverScreen.isShowing) {
            gameOverScreen.draw(ctx, canvas, player.name, player.level, killCounter);
        }

        // Keep the loop going
        window.requestAnimationFrame(gameLoop);
    }

    // Start with the welcome screen
    window.requestAnimationFrame(welcomeLoop);
}

// Wait for the page to load before starting
window.addEventListener("DOMContentLoaded", onStart);