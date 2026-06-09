import { drawTrisect, roomPattern, hallwayPattern } from "./game/map/drawTrisect.js";
import { StrongJacket } from "./game/items/Item.js";
import { Player } from "./game/player.js";
import { drawHUD, drawClassSelect, setClassHover, getClassFromClick, drawControlsPanel } from "./game/ui/HUD.js";
import { unregisterAllRooms, getActiveRoomId, activateRoom, freezeRoom, saveRoomSnapshot, getRoomSnapshot, getRoomById, getRoomWorldBounds, isRoomCleared, clearSpawnedRoom, } from "./game/map/roomRegistry.js";
import { boss } from "./game/entities/Boss.js";
import { Teacher1, Teacher2, Teacher3 } from "./game/entities/MiniBosses.js";
import { spawnRoomMobs, respawnRoomMobs } from "./game/spawner.js";
import { WelcomeScreen } from "./game/ui/WelcomeScreen.js";
import { Inventory } from "./game/ui/Inventory.js";
import { GameOverScreen } from "./game/ui/GameOver.js";
import { PauseMenu } from "./game/ui/PauseMenu.js";
export const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const map = document.createElement("canvas");
const mapCtx = map.getContext("2d");
mapCtx.imageSmoothingEnabled = false;
export const player = new Player(360, 720);
export const mobArray = [];
const miniBossArray = [];
let primaryBoss = null;
let killCounter = 0;
let activeRoomId = null;
let previousRoomId = null;
let bossDefeated = false;
let floorClearedTimer = 0;
let transitionFlashTimer = 0;
let gameStarted = false;
let primaryBossDropProcessed = false;
let pickupMessage = "";
let pickupMessageTimer = 0;
const deadMinibossRoomIds = new Set();
const TRISECT_TYPES = ["room", "hallway", "room"];
const welcomeScreen = new WelcomeScreen();
const inventory = new Inventory();
const gameOverScreen = new GameOverScreen();
const pauseMenu = new PauseMenu();
const floorStartX = 360;
const floorStartY = 720;
const roomDroppedItems = new Map();
const roomRespawnTimers = new Map();
function rectangularOverlapChecker(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function buildMap() {
    unregisterAllRooms();
    mobArray.length = 0;
    miniBossArray.length = 0;
    roomDroppedItems.clear();
    roomRespawnTimers.clear();
    const trisect1 = drawTrisect(mapCtx, 0, 720 / 2, roomPattern, undefined, hallwayPattern, undefined, roomPattern, undefined, TRISECT_TYPES);
    const trisect1Room3 = getRoomById(trisect1.roomIds[2]);
    const trisect2X = trisect1Room3
        ? trisect1Room3.roomX + trisect1Room3.cols * 36 - 36
        : 2052;
    const trisect2 = drawTrisect(mapCtx, trisect2X, 720 / 2, roomPattern, undefined, hallwayPattern, undefined, roomPattern, undefined, TRISECT_TYPES);
    const hallway1 = getRoomById(trisect1.roomIds[1]);
    const room3t1 = getRoomById(trisect1.roomIds[2]);
    const inkRoom = hallway1;
    const coachRoom = room3t1;
    const vpRoom = getRoomById(trisect2.roomIds[1]);
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
    const bossRoom = getRoomById(trisect2.roomIds[2]);
    if (bossRoom) {
        primaryBoss = new boss(bossRoom.roomX + 300, bossRoom.roomY + 300, "boss", "Final Entity", bossRoom.roomId);
    }
}
function updatePaintZoneStatus() {
    player.inPaintZone = false;
    const px = player.x + player.playerSize / 2;
    const py = player.y + player.playerSize / 2;
    for (const mb of miniBossArray) {
        if (mb.homeRoomId !== activeRoomId || mb.isDead)
            continue;
        for (const zone of mb.paintZones) {
            const dx = px - zone.x;
            const dy = py - zone.y;
            if (dx * dx + dy * dy < zone.radius * zone.radius) {
                player.inPaintZone = true;
                return;
            }
        }
    }
}
function handleRoomTransition() {
    const newRoomId = getActiveRoomId(player.x, player.y, activeRoomId);
    if (newRoomId !== activeRoomId) {
        if (activeRoomId !== null) {
            const snapshot = {
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
        previousRoomId = activeRoomId;
        activeRoomId = newRoomId;
        transitionFlashTimer = 10;
        if (activeRoomId !== null) {
            activateRoom(activeRoomId);
            const snapshot = getRoomSnapshot(activeRoomId);
            if (!snapshot) {
                const room = getRoomById(activeRoomId);
                if (room) {
                    const bounds = getRoomWorldBounds(activeRoomId);
                    const newMobs = spawnRoomMobs(activeRoomId, bounds.x, bounds.y, bounds.w, bounds.h, player.level, room.roomType);
                    mobArray.push(...newMobs);
                }
            }
        }
    }
}
function processMobDeaths() {
    for (let i = mobArray.length - 1; i >= 0; i--) {
        const mob = mobArray[i];
        if (!mob.isMobDead)
            continue;
        if (mob.homeRoomId !== activeRoomId)
            continue;
        killCounter++;
        const isHallway = mob.mobType === "Hall Monitor" || mob.mobType === "Teacher";
        if (isHallway) {
            player.increaseXP(200 + player.level * 20);
            const stats = ["mind", "body", "soul"];
            const pick = stats[Math.floor(Math.random() * 3)];
            player[pick] += 1;
        }
        else {
            player.increaseXP(250 + player.level * 25);
        }
        mobArray.splice(i, 1);
    }
}
function processMinibossDeaths() {
    for (const mb of miniBossArray) {
        if (mb.isDead && !mb.dropProcessed) {
            mb.dropProcessed = true;
            deadMinibossRoomIds.add(mb.homeRoomId);
            player.increaseXP(mb.xpReward);
            const item = mb.dropItem();
            const drops = roomDroppedItems.get(mb.homeRoomId) ?? [];
            drops.push({ item, x: mb.x + mb.bossSize / 2 - 15, y: mb.y + mb.bossSize / 2 - 15 });
            roomDroppedItems.set(mb.homeRoomId, drops);
            pickupMessage = item.name + " dropped!";
            pickupMessageTimer = 120;
            mb.onDeath();
        }
    }
}
function processPrimaryBossDeath() {
    if (!primaryBoss || !primaryBoss.isDead || primaryBossDropProcessed)
        return;
    primaryBossDropProcessed = true;
    player.increaseXP(1500);
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
function pickupItems() {
    if (activeRoomId === null)
        return;
    const drops = roomDroppedItems.get(activeRoomId);
    if (!drops)
        return;
    for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i];
        if (rectangularOverlapChecker(player.x, player.y, player.playerSize, player.playerSize, drop.x, drop.y, 30, 30)) {
            if (inventory.addItem(drop.item)) {
                drops.splice(i, 1);
                player.equipItem(drop.item);
                pickupMessage = "Picked up " + drop.item.name + "!";
                pickupMessageTimer = 90;
            }
        }
    }
}
function handleRoomRespawn() {
    if (bossDefeated || activeRoomId === null)
        return;
    if (isRoomCleared(activeRoomId, mobArray)) {
        const timer = roomRespawnTimers.get(activeRoomId) ?? 0;
        if (timer <= 0) {
            roomRespawnTimers.set(activeRoomId, 300);
        }
        else {
            roomRespawnTimers.set(activeRoomId, timer - 1);
            if (timer - 1 <= 0) {
                const room = getRoomById(activeRoomId);
                const bounds = getRoomWorldBounds(activeRoomId);
                if (room && bounds) {
                    clearSpawnedRoom(activeRoomId);
                    const newMobs = respawnRoomMobs(activeRoomId, bounds.x, bounds.y, bounds.w, bounds.h, player.level, room.roomType);
                    mobArray.push(...newMobs);
                }
            }
        }
    }
    else {
        roomRespawnTimers.set(activeRoomId, 0);
    }
}
function resetGame(fullReset) {
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
    buildMap();
}
function loadSaveIfContinuing() {
    const raw = localStorage.getItem("wroc_save");
    if (!raw || !welcomeScreen.continuingFromSave)
        return;
    try {
        const data = JSON.parse(raw);
        if (data.level)
            player.level = data.level;
        if (data.xp)
            player.xp = data.xp;
        if (data.health)
            player.health = data.health;
        if (data.stamina)
            player.stamina = data.stamina;
        if (data.killCount)
            killCounter = data.killCount;
        player.xpToNextLevel = 100 * Math.pow(2, player.level);
    }
    catch {
    }
}
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
function onStart() {
    player.movementKeys();
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.imageSmoothingEnabled = false;
        map.width = 2160 * 3;
        map.height = 2160 * 3;
        mapCtx.imageSmoothingEnabled = false;
        buildMap();
    }
    window.addEventListener("resize", resize);
    resize();
    function welcomeLoop() {
        if (!welcomeScreen.isComplete) {
            welcomeScreen.draw(ctx, canvas);
            window.requestAnimationFrame(welcomeLoop);
            return;
        }
        player.name = welcomeScreen.playerName || "Player";
        player.setColors(welcomeScreen.skinColor, welcomeScreen.clothesColor);
        loadSaveIfContinuing();
        gameStarted = true;
        window.requestAnimationFrame(gameLoop);
    }
    window.addEventListener("keydown", e => {
        if (!gameStarted) {
            welcomeScreen.handleInput(e);
            return;
        }
        if (gameOverScreen.isShowing || pauseMenu.isOpen)
            return;
        if (e.key === "Escape") {
            pauseMenu.isOpen = !pauseMenu.isOpen;
            return;
        }
        if (e.key === "e") {
            if (inventory.isOpen)
                inventory.close();
            else
                inventory.open();
            return;
        }
        if (player.classSelect) {
            if (e.key === "1")
                player.selectClass("Language");
            else if (e.key === "2")
                player.selectClass("STEM");
            else if (e.key === "3")
                player.selectClass("Sports");
            else if (e.key === "4")
                player.selectClass("None");
            return;
        }
        if (e.key === "q" && !inventory.isOpen) {
            const allBosses = [...miniBossArray, ...(primaryBoss ? [primaryBoss] : [])];
            player.tryAbility(mobArray, allBosses);
        }
    });
    window.addEventListener("click", e => {
        if (!gameStarted) {
            welcomeScreen.handleClick(e, canvas);
            return;
        }
        if (gameOverScreen.isShowing) {
            const action = gameOverScreen.handleClick(e, canvas);
            if (action === "respawn") {
                gameOverScreen.hide();
                resetGame(false);
            }
            else if (action === "menu") {
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
                    resetGame(true);
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
            const rect = canvas.getBoundingClientRect();
            const choice = getClassFromClick(e.clientX - rect.left, e.clientY - rect.top, canvas);
            if (choice)
                player.selectClass(choice);
        }
    });
    window.addEventListener("mousemove", e => {
        if (player.classSelect) {
            const rect = canvas.getBoundingClientRect();
            setClassHover(e.clientX - rect.left, e.clientY - rect.top, canvas);
        }
    });
    function gameLoop() {
        if (!gameStarted)
            return;
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
        const camX = Math.round((canvas.width / 2) - player.x);
        const camY = Math.round((canvas.height / 2) - player.y);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(camX, camY);
        ctx.drawImage(map, 0, 0);
        if (!player.isPlayerDead && !inventory.isOpen) {
            updatePaintZoneStatus();
            player.update();
            handleRoomTransition();
        }
        player.draw(ctx);
        for (let i = mobArray.length - 1; i >= 0; i--) {
            const mob = mobArray[i];
            if (mob.homeRoomId !== activeRoomId)
                continue;
            if (mob.isMobDead)
                continue;
            mob.draw(ctx);
            if (!player.isPlayerDead && !inventory.isOpen) {
                mob.mobMovement(player);
                const isTouching = rectangularOverlapChecker(player.x, player.y, player.playerSize, player.playerSize, mob.mobX, mob.mobY, mob.mobSize, mob.mobSize);
                if (isTouching) {
                    const timeNow = performance.now();
                    if (timeNow - mob.lastAttackTime >= mob.attackCooldown) {
                        player.loseHP(mob);
                        mob.lastAttackTime = timeNow;
                    }
                }
                if (player.keys.has("r") && isTouching) {
                    player.tryAttack(mob);
                }
            }
        }
        for (const mb of miniBossArray) {
            if (mb.homeRoomId !== activeRoomId)
                continue;
            mb.draw(ctx);
            if (!mb.isDead && !player.isPlayerDead && !inventory.isOpen) {
                mb.bossMovement(player);
                mb.tryNormalAttack(player);
                if (player.keys.has("r")) {
                    const touching = rectangularOverlapChecker(player.x, player.y, player.playerSize, player.playerSize, mb.x, mb.y, mb.bossSize, mb.bossSize);
                    if (touching)
                        mb.loseHP(player);
                }
            }
        }
        if (primaryBoss && primaryBoss.homeRoomId === activeRoomId) {
            primaryBoss.draw(ctx);
            if (!primaryBoss.isDead && !player.isPlayerDead && !inventory.isOpen) {
                primaryBoss.bossMovement(player);
                primaryBoss.tryNormalAttack(player);
                if (player.keys.has("r")) {
                    const touching = rectangularOverlapChecker(player.x, player.y, player.playerSize, player.playerSize, primaryBoss.x, primaryBoss.y, primaryBoss.bossSize, primaryBoss.bossSize);
                    if (touching)
                        primaryBoss.loseHP(player);
                }
            }
            if (primaryBoss.isDead && !bossDefeated) {
                bossDefeated = true;
                floorClearedTimer = 180;
            }
        }
        const drops = activeRoomId !== null ? roomDroppedItems.get(activeRoomId) : undefined;
        if (drops) {
            const pulse = 0.5 + Math.sin(performance.now() / 200) * 0.3;
            for (const drop of drops) {
                ctx.fillStyle = `rgba(255, 220, 80, ${pulse * 0.4})`;
                ctx.beginPath();
                ctx.arc(drop.x + 15, drop.y + 15, 22, 0, Math.PI * 2);
                ctx.fill();
                drop.item.draw(ctx, drop.x, drop.y, 30);
            }
        }
        if (!player.isPlayerDead && !inventory.isOpen) {
            processMobDeaths();
            processMinibossDeaths();
            processPrimaryBossDeath();
            pickupItems();
            handleRoomRespawn();
        }
        if (pickupMessageTimer > 0)
            pickupMessageTimer--;
        if (player.isPlayerDead && !gameOverScreen.isShowing) {
            gameOverScreen.show();
        }
        ctx.restore();
        if (transitionFlashTimer > 0) {
            const alpha = transitionFlashTimer > 8 ? (16 - transitionFlashTimer) / 8 : transitionFlashTimer / 8;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            transitionFlashTimer--;
        }
        const vig = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.25, canvas.width / 2, canvas.height / 2, canvas.height * 0.75);
        vig.addColorStop(0, "rgba(0,0,0,0)");
        vig.addColorStop(1, "rgba(0,0,0,0.35)");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawHUD(ctx, canvas, player, killCounter);
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
        if (!inventory.isOpen && !gameOverScreen.isShowing) {
            drawControlsPanel(ctx, canvas);
        }
        if (player.classSelect) {
            drawClassSelect(ctx, canvas);
        }
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
        if (inventory.isOpen) {
            inventory.draw(ctx, canvas, player);
        }
        if (gameOverScreen.isShowing) {
            gameOverScreen.draw(ctx, canvas, player.name, player.level, killCounter);
        }
        window.requestAnimationFrame(gameLoop);
    }
    window.requestAnimationFrame(welcomeLoop);
}
window.addEventListener("DOMContentLoaded", onStart);
//# sourceMappingURL=main.js.map