let currentSceneId = 'start';
let playerHealth = 100;
let gameActive = true;

const scenes = {
    start: {
        text: `You are Percy Jackson, and you've just learned that Kronos's forces are using the Labyrinth to invade Camp Half-Blood. You stand at the entrance of the ancient Labyrinth with Annabeth, Grover, and Tyson.\n\nThe air is thick with danger. You must choose your next move carefully—one wrong decision could be fatal.`,
        choices: [
            { text: "🗡️ Head straight into the Labyrinth with your sword", next: 'labyrinthDirect', health: 0 },
            { text: "📜 Consult Annabeth's knowledge of the Labyrinth", next: 'consulAnnabeth', health: 0 },
            { text: "🌳 Ask Grover to smell out the safest path", next: 'groverPath', health: 0 }
        ]
    },
    
    labyrinthDirect: {
        text: `You charge into the Labyrinth with water cascading around you. Within minutes, you encounter a massive Empusa—a demon with the face of a woman and legs of bronze.\n\nYou manage to fight it off with your sword, but not before she slashes your arm deeply. You're wounded and bleeding.`,
        choices: [
            { text: "💧 Use your water powers to heal your wound", next: 'waterHeal', health: -20 },
            { text: "🏃 Run deeper inside hoping to find help", next: 'runDeeper', health: -15 },
            { text: "⚡ Channel your godly father's lightning for strength", next: 'lightningPower', health: -10 }
        ]
    },
    
    consulAnnabeth: {
        text: `Annabeth studies her map of the Labyrinth carefully. "We should avoid the central paths," she warns. "Kronos's forces control them. We need to move through the shadows."\n\nYou follow her strategic route and manage to avoid several traps and monsters. Your progress is slow but steady.`,
        choices: [
            { text: "🗺️ Continue following Annabeth's planned route", next: 'followPlan', health: 0 },
            { text: "🤝 Split up to cover more ground faster", next: 'splitUp', health: -15 },
            { text: "💭 Trust your instincts and take a shortcut", next: 'trustInstinct', health: 0 }
        ]
    },
    
    groverPath: {
        text: `Grover closes his eyes and breathes deeply. "This way," he says, leading you through a hidden passage that smells of old nature and magic.\n\nYou come across a serene glade—one of nature's sanctuaries. A group of satyrs offers you safe passage and supplies.`,
        choices: [
            { text: "🤝 Accept their help and move on strengthened", next: 'acceptHelp', health: 10 },
            { text: "⚠️ Be suspicious and prepare for a trap", next: 'beSuspicious', health: 0 },
            { text: "🎭 Ask them for information about Kronos's plan", next: 'gatherIntel', health: 0 }
        ]
    },
    
    waterHeal: {
        text: `You summon your water powers and the wound closes miraculously. Your arm feels refreshed, and you notice your strength returning.\n\nWith renewed confidence, you press deeper into the Labyrinth. Ahead, you see a fork in the path with two doors.`,
        choices: [
            { text: "🚪 Enter the left door—it glows with a faint blue light", next: 'leftDoor', health: 0 },
            { text: "🚪 Enter the right door—you hear voices from within", next: 'rightDoor', health: 0 },
            { text: "🔮 Use your senses to determine which path is safe", next: 'useSenses', health: 0 }
        ]
    },
    
    runDeeper: {
        text: `You run through the winding corridors, your breath coming in gasps. The Labyrinth seems to shift and change around you, making everything disorienting.\n\nYou stumble into a massive chamber where you find Daedalus himself! He's creating weapons for Kronos.`,
        choices: [
            { text: "💣 Attack Daedalus and destroy his weapons", next: 'attackDaedalus', health: -30 },
            { text: "🗣️ Try to negotiate and turn him against Kronos", next: 'negotiateDaedalus', health: 0 },
            { text: "🏃 Try to escape and sabotage his work from outside", next: 'escapeAndSabotage', health: -10 }
        ]
    },
    
    lightningPower: {
        text: `You channel your godly father Poseidon's power... wait, lightning? That's not your power!\n\nYou've confused your abilities. Without proper control, the lightning backfires, striking you. You collapse, badly burnt and weakened, crawling through the Labyrinth in pain.`,
        choices: [
            { text: "🩹 Keep moving despite the pain to find shelter", next: 'keepMoving', health: -50 },
            { text: "🆘 Call out for help from your companions", next: 'callForHelp', health: -30 },
            { text: "⚰️ Accept defeat", next: 'died', health: -100 }
        ]
    },
    
    followPlan: {
        text: `You carefully follow Annabeth's strategic route through the Labyrinth. Her knowledge of these ancient paths proves invaluable.\n\nYou successfully reach the heart of Kronos's operation: a massive cavern filled with monsters preparing for invasion. You see the entrance to his throne room.`,
        choices: [
            { text: "🎯 Confront Kronos directly in his throne room", next: 'confrontKronos', health: 0 },
            { text: "💣 Sabotage the monsters' assembly first", next: 'sabotageMonsters', health: -20 },
            { text: "📡 Find a way to alert Camp Half-Blood of the invasion", next: 'alertCamp', health: 0 }
        ]
    },
    
    splitUp: {
        text: `You and your friends split up to cover more ground. Big mistake.\n\nWithin moments, you're separated and completely lost in the Labyrinth. You hear the screams of your companions echoing from different directions. You rush toward one sound and encounter a wraith—a manifestation of fear and despair.`,
        choices: [
            { text: "💪 Face your fear and fight the wraith head-on", next: 'fightWraith', health: -35 },
            { text: "🏃 Run from the wraith and regroup with your friends", next: 'regroup', health: -20 },
            { text: "🌊 Use your water powers to try to disperse it", next: 'waterAgainstWraith', health: -15 }
        ]
    },
    
    trustInstinct: {
        text: `You decide to trust your instincts and take a shortcut through what Annabeth says is forbidden territory.\n\nYour instincts serve you well—you find a secret passage that leads directly to Kronos's fortress. But you've also triggered ancient alarms, and now monsters are hunting you.`,
        choices: [
            { text: "⚡ Use the alarm's distraction to strike at Kronos", next: 'strikeNow', health: 0 },
            { text: "🏃 Prepare an ambush point for the incoming monsters", next: 'prepareAmbush', health: -20 },
            { text: "🚪 Try to find a back entrance while they're distracted", next: 'findBackEntrance', health: 0 }
        ]
    },
    
    acceptHelp: {
        text: `The satyrs provide you with magical armor and potions. You feel empowered and blessed by nature itself.\n\nWith renewed strength and protection, you venture deeper and successfully infiltrate Kronos's command center undetected.`,
        choices: [
            { text: "💻 Access their plans and steal their secrets", next: 'stealPlans', health: 0 },
            { text: "💣 Destroy their command center immediately", next: 'destroyCenter', health: -20 },
            { text: "👁️ Spy from the shadows to gather more information", next: 'spyOnCronos', health: 0 }
        ]
    },
    
    beSuspicious: {
        text: `Your suspicions are justified! The satyrs were actually creatures of Kronos in disguise. They attack you viciously!\n\nYou manage to fight them off, but not without significant injuries. You escape, bleeding and exhausted, but alive.`,
        choices: [
            { text: "🩹 Rest and recover in a hidden location", next: 'restRecover', health: -25 },
            { text: "💨 Push forward despite your injuries", next: 'pushForward', health: -40 },
            { text: "⚔️ Hunt down these creatures for revenge", next: 'huntCreatures', health: -35 }
        ]
    },
    
    gatherIntel: {
        text: `The satyrs reveal valuable information: Kronos is weakening, but he's preparing one final massive attack. They tell you that destroying the Labyrinth's central nexus will stop his forces.\n\nYou now know exactly where you need to go and what you need to do.`,
        choices: [
            { text: "🎯 Head directly to the central nexus", next: 'headToNexus', health: 0 },
            { text: "🛡️ Gather more allies before attempting the nexus", next: 'gatherAllies', health: 0 },
            { text: "🔮 Meditate to strengthen your powers for the final battle", next: 'meditate', health: 10 }
        ]
    },
    
    leftDoor: {
        text: `The blue light draws you into a chamber of pure water—the domain of sea creatures. Nereids greet you.\n\n"We sense your godly blood," they say. "Poseidon's son has come to help us reclaim the Labyrinth from Kronos's darkness."`,
        choices: [
            { text: "🤝 Form an alliance with the Nereids", next: 'nereidsAlliance', health: 10 },
            { text: "⚠️ Question their motives", next: 'questionNereids', health: 0 },
            { text: "🌊 Ask them to guide you deeper into the Labyrinth", next: 'nereidsGuide', health: 5 }
        ]
    },
    
    rightDoor: {
        text: `The voices belong to captured demigods—other children of the gods! They're being held prisoner by Kronos's forces.\n\nYou now have a choice: rescue them and gain allies, or free them knowing it might alert Kronos to your presence.`,
        choices: [
            { text: "⚔️ Free the prisoners and fight your way out together", next: 'rescuePrisoners', health: -15 },
            { text: "🗣️ Talk to them and make a plan first", next: 'planRescue', health: 0 },
            { text: "⚠️ Leave them for now to continue your mission", next: 'continueAlone', health: 0 }
        ]
    },
    
    useSenses: {
        text: `You close your eyes and let your demigod senses guide you. The left door channels water energy—your energy. The right door carries the scent of monsters.\n\nYou confidently choose the left door and enter an ancient chamber filled with knowledge and power.`,
        choices: [
            { text: "📚 Study the ancient inscriptions about Kronos's weaknesses", next: 'studyInscriptions', health: 0 },
            { text: "⚡ Absorb as much power as you can", next: 'absorbPower', health: 20 },
            { text: "🚪 Use this chamber to prepare for the final confrontation", next: 'prepareFinal', health: 25 }
        ]
    },
    
    attackDaedalus: {
        text: `You engage Daedalus in combat. He's ancient and incredibly skilled, but you have youth and godly power on your side.\n\nAfter an intense battle, you manage to destroy his weapon forge. The explosion rocks the Labyrinth, weakening Kronos's supply line significantly.`,
        choices: [
            { text: "🏃 Escape before the chamber collapses", next: 'escapeExplosion', health: -20 },
            { text: "⚰️ Ensure Daedalus falls with his creations", next: 'defeatsKronos', health: -15 },
            { text: "🚪 Use the chaos to slip toward Kronos's chamber", next: 'slipToCronos', health: 0 }
        ]
    },
    
    negotiateDaedalus: {
        text: `Against all odds, Daedalus listens to your words. He's tired of serving Kronos, tired of being trapped in his own creation.\n\n"I will help you," he says, "but the cost is high. I must die here, and the Labyrinth must be destroyed."`,
        choices: [
            { text: "🤝 Accept his sacrifice and destroy the Labyrinth with him", next: 'acceptSacrifice', health: 0 },
            { text: "⚠️ Refuse—there must be another way", next: 'refuseSacrifice', health: 0 },
            { text: "🛡️ Protect him while searching for an alternative", next: 'protectDaedalus', health: -10 }
        ]
    },
    
    escapeAndSabotage: {
        text: `You manage to escape Daedalus's chamber, but as you run, you plant magical bombs throughout the weapon factory.\n\nThe explosions behind you are massive. You've significantly weakened Kronos's military might, but you've also revealed your presence.`,
        choices: [
            { text: "💨 Use the chaos to race toward Kronos", next: 'raceToKronos', health: -10 },
            { text: "🛡️ Find allies among the rebel forces", next: 'findRebels', health: 0 },
            { text: "🏃 Retreat and replan your strategy", next: 'retreat', health: 0 }
        ]
    },
    
    keepMoving: {
        text: `Despite the terrible pain from your burnt skin, you crawl through the Labyrinth. Each step is agony. Your vision blurs, but you refuse to give up.\n\nJust when you think you can't go on anymore, you collapse near the camp's emergency location beacon.`,
        choices: [
            { text: "📡 Activate the beacon despite your condition", next: 'activateBeacon', health: -40 },
            { text: "⚰️ Surrender to your injuries", next: 'died', health: -100 },
            { text: "💪 Make one final push toward the exit", next: 'finalPush', health: -30 }
        ]
    },
    
    callForHelp: {
        text: `You scream for help, and miraculously, you hear responding calls. Your companions haven't abandoned you!\n\nAnnabeth and Grover find you and help you to a safe chamber. They use healing herbs and your water powers to stabilize your condition.`,
        choices: [
            { text: "🤝 Continue the mission together, stronger than before", next: 'continueTogether', health: 20 },
            { text: "📜 Make a new plan with Annabeth and Grover", next: 'planWithFriends', health: 15 },
            { text: "🎯 Head directly to confront Kronos with renewed determination", next: 'confrontKronosDirectly', health: 0 }
        ]
    },
    
    confrontKronos: {
        text: `You step into Kronos's throne room. The Titan Lord sits before you, massive and ancient, darkness swirling around him.\n\n"Percy Jackson," he growls. "I've been waiting for you. Let us end this." He raises his scythe, ready for the final battle.`,
        choices: [
            { text: "⚡ Unleash all your power in a devastating attack", next: 'powerAttack', health: -25 },
            { text: "🧠 Use strategy—find his weakness first", next: 'findWeakness', health: 0 },
            { text: "💧 Submerge the chamber in water and fight in your element", next: 'waterBattle', health: -15 }
        ]
    },
    
    sabotageMonsters: {
        text: `You sabotage the monster assembly with explosives and clever tactics. Hundreds of monsters fall before they can even launch the invasion.\n\nKronos, enraged, emerges from his throne room to confront you personally.`,
        choices: [
            { text: "⚔️ Face him in single combat", next: 'singleCombat', health: 0 },
            { text: "🤝 Use the monster chaos to get reinforcements", next: 'getReinforcements', health: 0 },
            { text: "🏃 Escape and plan a counter-attack", next: 'counterAttack', health: 0 }
        ]
    },
    
    alertCamp: {
        text: `You manage to send an enchanted message to Camp Half-Blood. Help is on the way!\n\nKronos discovers your betrayal moments later. He moves to kill you, but you've bought the camp precious time to prepare their defenses.`,
        choices: [
            { text: "🏃 Survive long enough for reinforcements to arrive", next: 'surviveUntilReinforcements', health: -20 },
            { text: "⚔️ Make a last stand against Kronos's forces", next: 'lastStand', health: -30 },
            { text: "💨 Escape through the Labyrinth and meet reinforcements outside", next: 'escapeToCamp', health: 0 }
        ]
    },
    
    fightWraith: {
        text: `The wraith is manifestation of pure fear and despair, but you refuse to back down. Your courage burns bright like a beacon.\n\nWith every ounce of determination, you cut through the wraith's form. It dissipates with an otherworldly scream. You've conquered your fear itself!`,
        choices: [
            { text: "💪 Follow the sound of your companions with renewed strength", next: 'followCompanions', health: 0 },
            { text: "🧭 Use your newfound confidence to navigate the Labyrinth", next: 'navigateLab', health: 10 },
            { text: "🎯 Press toward your mission with unshakeable resolve", next: 'pressForward', health: 0 }
        ]
    },
    
    regroup: {
        text: `You race through the Labyrinth and manage to regroup with Annabeth, Grover, and Tyson. Together again, you feel stronger and more confident.\n\nAnnabeth has found a map pointing to Kronos's location. With your team united, you charge forward.`,
        choices: [
            { text: "🤐 Sneak in quietly as a team", next: 'teamSneakIn', health: 0 },
            { text: "⚔️ Charge in with force together", next: 'teamCharge', health: -10 },
            { text: "🗺️ Use Annabeth's map to find an optimal route", next: 'optimalRoute', health: 0 }
        ]
    },
    
    waterAgainstWraith: {
        text: `You summon your water powers and create a massive torrent. The wraith, being a creature of pure magic and despair, cannot withstand the living, flowing power of water.\n\nIt dissipates in a cloud of mist. Your water abilities have proven more powerful than you thought.`,
        choices: [
            { text: "💧 Continue using water as your main weapon", next: 'waterMaster', health: 0 },
            { text: "🧭 Find your companions and continue the quest", next: 'findCompanions', health: 5 },
            { text: "🎯 Head directly to Kronos's location", next: 'directToCronos', health: 0 }
        ]
    },
    
    strikeNow: {
        text: `Using the chaos and alarm to your advantage, you burst into Kronos's outer defenses. The confusion gives you the upper hand.\n\nYou fight your way through waves of monsters and finally reach Kronos's inner sanctum. The Titan Lord knows he's been infiltrated.`,
        choices: [
            { text: "⚡ Attack him immediately while he's unprepared", next: 'unpreparedAttack', health: -20 },
            { text: "🗣️ Demand his surrender", next: 'demandSurrender', health: 0 },
            { text: "🔮 Challenge him to single combat", next: 'singleCombatKronos', health: 0 }
        ]
    },
    
    prepareAmbush: {
        text: `You quickly set up an ambush with traps and prepared positions. When the monsters arrive, you unleash chaos upon them.\n\nYour tactical brilliance eliminates over half the pursuing force. You've bought yourself precious time and breathing room.`,
        choices: [
            { text: "✅ Use this victory to reach Kronos's inner chamber", next: 'reachInner', health: -10 },
            { text: "💪 Continue hunting the remaining monsters", next: 'huntRemaining', health: -15 },
            { text: "📡 Gather intelligence before the final confrontation", next: 'gatherFinalIntel', health: 0 }
        ]
    },
    
    findBackEntrance: {
        text: `You discover a servant's entrance to Kronos's fortress—used by his minions over the centuries. It's unguarded and hidden from view.\n\nYou slip inside undetected, right into the heart of his power base.`,
        choices: [
            { text: "🗡️ Go directly to Kronos", next: 'directConfrontation', health: 0 },
            { text: "📚 Search for anything that could help defeat him", next: 'searchFortress', health: -5 },
            { text: "🎯 Set up for a perfect ambush", next: 'perfectAmbush', health: 0 }
        ]
    },
    
    stealPlans: {
        text: `You manage to steal Kronos's complete war plans. The intelligence is invaluable—it shows weaknesses, troop movements, and his schedule.\n\nWith this knowledge, you can orchestrate a devastating counter-attack.`,
        choices: [
            { text: "📡 Send the plans to Camp Half-Blood immediately", next: 'sendPlans', health: 0 },
            { text: "⚔️ Use the information to strike now", next: 'strikeWithInfo', health: -15 },
            { text: "🎯 Plan the perfect time to eliminate Kronos", next: 'perfectTiming', health: 0 }
        ]
    },
    
    destroyCenter: {
        text: `You launch a devastating attack on Kronos's command center. Explosions rock the fortress, and his communication systems are destroyed.\n\nWithout coordination, his forces falter. Kronos himself emerges, furious and ready for battle.`,
        choices: [
            { text: "⚔️ Meet him head-on in combat", next: 'headOnCombat', health: -20 },
            { text: "🏃 Escape and use the chaos to your advantage", next: 'escapeUseChoas', health: 0 },
            { text: "💣 Plant one final bomb for the killing blow", next: 'finalBomb', health: -35 }
        ]
    },
    
    spyOnCronos: {
        text: `You hide in the shadows of Kronos's throne room and observe him closely. You notice something crucial—his power fluctuates every few minutes, suggesting a source outside him, possibly a phylactery or artifact.\n\nIf you can destroy that source, Kronos will be vulnerable.`,
        choices: [
            { text: "🔍 Search for the source of his power", next: 'searchPower', health: -10 },
            { text: "⚔️ Attack him during his weak moments", next: 'weakMomentAttack', health: 0 },
            { text: "📡 Report your findings to your allies", next: 'reportFindings', health: 0 }
        ]
    },
    
    restRecover: {
        text: `You find a sacred place within the Labyrinth and rest. Your body heals faster than normal thanks to your demigod nature.\n\nAfter recovering, you feel strong again—ready to face whatever comes next.`,
        choices: [
            { text: "⚡ Seek out Kronos and end this", next: 'seekKronos', health: 0 },
            { text: "🤝 Find your companions and reunite", next: 'reuniteCompanions', health: 10 },
            { text: "📚 Search for any knowledge that could help you", next: 'searchKnowledge', health: 0 }
        ]
    },
    
    pushForward: {
        text: `You push forward despite your severe injuries. Every step is excruciating, but your will is unbreakable.\n\nEventually, your wounds become too much. You collapse, but not before triggering an alarm that brings help rushing toward your location.`,
        choices: [
            { text: "⚰️ Accept death as a hero", next: 'died', health: -100 },
            { text: "💪 Hold on just a bit longer for rescue", next: 'holdOn', health: -45 },
            { text: "🌊 Use your last bit of power to heal yourself", next: 'lastHeal', health: -30 }
        ]
    },
    
    huntCreatures: {
        text: `Your rage fuels you. You hunt down every one of those false satyrs and eliminate them with prejudice.\n\nYour vengeance satisfied, you've also eliminated a significant portion of Kronos's infiltration network. You've inadvertently helped the good cause.`,
        choices: [
            { text: "🎯 Now focus on the main objective—Kronos himself", next: 'focusKronos', health: -20 },
            { text: "🤝 Find your real companions", next: 'findRealCompanions', health: -15 },
            { text: "📡 Report your success to Camp Half-Blood", next: 'reportSuccess', health: 0 }
        ]
    },
    
    headToNexus: {
        text: `You race toward the Labyrinth's central nexus. It's a place of immense power, ancient and primordial.\n\nWhen you arrive, you find it's being guarded by Kronos's most powerful servants, but you also find the weak point mentioned by the satyrs.`,
        choices: [
            { text: "⚔️ Fight the guardians directly", next: 'fightGuardians', health: -30 },
            { text: "🎯 Destroy the nexus without engaging", next: 'destroyNexusQuick', health: -10 },
            { text: "🧠 Use strategy to turn the guards against each other", next: 'turnGuards', health: 0 }
        ]
    },
    
    gatherAllies: {
        text: `You find several pockets of resistance within the Labyrinth—creatures and demigods who oppose Kronos.\n\nWith your leadership, you unite them into a formidable force. Together, you march toward the central nexus.`,
        choices: [
            { text: "🪖 Lead a coordinated assault on the nexus", next: 'coordinatedAssault', health: -15 },
            { text: "📜 Plan a strategic multi-pronged attack", next: 'multiProngedAttack', health: 0 },
            { text: "🗳️ Use your allies to create a diversion while you attack", next: 'useDiversion', health: -10 }
        ]
    },
    
    meditate: {
        text: `You sit in meditation, drawing power from your godly heritage. The waves themselves seem to answer your call. You can feel Poseidon's presence blessing you with immense power.\n\nYou rise, fully charged and ready for the ultimate battle.`,
        choices: [
            { text: "⚡ Head to the nexus with godly power flowing through you", next: 'godlyPowerNexus', health: 0 },
            { text: "🗡️ Go directly to challenge Kronos", next: 'challengeKronosGodly', health: 0 },
            { text: "🌊 Summon an army of sea creatures to aid you", next: 'summonSeaArmy', health: 0 }
        ]
    },
    
    nereidsAlliance: {
        text: `The Nereids become your allies. With their help, you gain passage through the deepest parts of the Labyrinth where water flows eternally.\n\nYou emerge at Kronos's inner sanctum, having bypassed most of his defenses.`,
        choices: [
            { text: "🗡️ Confront Kronos with the Nereids' support", next: 'confrontWithNereids', health: -10 },
            { text: "💧 Use their water magic to amplify your powers", next: 'amplifyPowers', health: 0 },
            { text: "🎯 Strike while Kronos is unprepared", next: 'strikeUnprepared', health: -5 }
        ]
    },
    
    questionNereids: {
        text: `The Nereids understand your caution. "We serve the sea and peace," they explain. "Kronos's darkness threatens both. Help us, and we will help you."\n\nYou sense their sincerity. You form an uneasy but genuine alliance.`,
        choices: [
            { text: "🤝 Accept their alliance", next: 'acceptAlliance', health: 5 },
            { text: "📍 Ask them to point you toward Kronos", next: 'getDirection', health: 0 },
            { text: "💪 Ask them to join you in battle", next: 'joinBattle', health: 0 }
        ]
    },
    
    nereidsGuide: {
        text: `The Nereids guide you through hidden underwater passages that connect to Kronos's fortress.\n\nYou emerge directly behind his throne, completely undetected. The element of surprise is entirely yours.`,
        choices: [
            { text: "⚡ Strike immediately before he realizes you're here", next: 'strikeFromBehind', health: -10 },
            { text: "👁️ Prepare your attack carefully", next: 'prepareCarefully', health: 0 },
            { text: "🗣️ Confront him face-to-face", next: 'confront', health: 0 }
        ]
    },
    
    rescuePrisoners: {
        text: `You move with incredible speed and power, freeing the prisoners and fighting off the guards.\n\nThe freed demigods are grateful and powerful. Together, you become a much stronger force. They join you in your mission against Kronos.`,
        choices: [
            { text: "🤝 March together toward Kronos's location", next: 'marchTogether', health: -10 },
            { text: "📜 Make a coordinated battle plan", next: 'battlePlan', health: 0 },
            { text: "⚔️ Charge into Kronos's forces while momentum is on your side", next: 'chargeMomentum', health: -15 }
        ]
    },
    
    planRescue: {
        text: `You discuss the situation with the prisoners. They have valuable information about Kronos's layout and guard patterns.\n\nWith their intel, you devise a perfect rescue plan that minimizes risk and maximizes your chances of success.`,
        choices: [
            { text: "✅ Execute the plan flawlessly", next: 'executePerfect', health: -5 },
            { text: "⚔️ Execute the plan with overwhelming force", next: 'executeForce', health: -15 },
            { text: "🎯 Use the prisoners' knowledge to directly attack Kronos", next: 'directAttackKronos', health: -20 }
        ]
    },
    
    continueAlone: {
        text: `You decide to continue alone. The prisoners understand but have lost hope. As you leave, you can hear them calling out, begging for rescue.\n\nYour heart is heavy, but you know your mission is critical. You press forward toward Kronos.`,
        choices: [
            { text: "⚔️ Face Kronos alone with full determination", next: 'faceAlone', health: 0 },
            { text: "💪 Gather more power before the confrontation", next: 'gatherMorePower', health: 0 },
            { text: "🎯 Plan your final attack carefully", next: 'planFinal', health: 0 }
        ]
    },
    
    studyInscriptions: {
        text: `Ancient writings reveal Kronos's greatest weakness—he is tied to the original Labyrinth. The more of it that is destroyed, the weaker he becomes.\n\nYou now know exactly what you must do.`,
        choices: [
            { text: "💣 Systematically destroy the Labyrinth", next: 'destroyLabyrinth', health: -25 },
            { text: "🎯 Attack Kronos while deliberately destroying passages", next: 'attackAndDestroy', health: -20 },
            { text: "📡 Share this knowledge with your allies", next: 'shareKnowledge', health: 0 }
        ]
    },
    
    absorbPower: {
        text: `You channel the ancient power of the chamber into yourself. It's intoxicating, overwhelming, but incredible.\n\nYou emerge glowing with power, feeling like you could take on the world. You are now significantly stronger.`,
        choices: [
            { text: "⚡ Go directly to Kronos and end this", next: 'endThis', health: 0 },
            { text: "💪 Test your new powers against his forces first", next: 'testPowers', health: -10 },
            { text: "🎯 Head to the nexus with amplified power", next: 'nexusAmplified', health: 0 }
        ]
    },
    
    prepareFinal: {
        text: `You use the chamber to prepare physically, mentally, and spiritually for the final confrontation.\n\nYou emerge focused, calm, and ready. You've never felt more prepared for anything in your life.`,
        choices: [
            { text: "🗡️ Advance to Kronos's location", next: 'advanceKronos', health: 0 },
            { text: "⚡ Meditate one more time to achieve perfect clarity", next: 'finalMeditation', health: 5 },
            { text: "💪 Seek additional allies with your newfound confidence", next: 'seekAllies', health: 0 }
        ]
    },
    
    escapeExplosion: {
        text: `You race against time as the chamber collapses. Debris flies everywhere, and your courage is tested to its limits.\n\nYou manage to escape! You're battered and exhausted, but you've succeeded in your objective.`,
        choices: [
            { text: "📡 Report your success and receive reinforcements", next: 'reportSuccess2', health: 0 },
            { text: "🎯 Continue toward Kronos before he can recover", next: 'continueQuickly', health: -15 },
            { text: "🩹 Rest briefly and then advance", next: 'restThenAdvance', health: -10 }
        ]
    },
    
    defeatsKronos: {
        text: `You ensure Daedalus and his creations fall together. As the chamber explodes around you, you see the ancient inventor smile.\n\n"Thank you," he whispers. "I'm finally free."\n\nYou mourn the sacrifice but recognize its necessity. Now, with his creations destroyed, you must face Kronos directly.`,
        choices: [
            { text: "⚔️ Face Kronos in his fury at losing Daedalus", next: 'angryKronos', health: -20 },
            { text: "🏃 Use Daedalus's knowledge to navigate to Kronos quickly", next: 'daedalusPath', health: 0 },
            { text: "💪 Let Daedalus's sacrifice fuel your determination", next: 'fueled', health: 0 }
        ]
    },
    
    slipToCronos: {
        text: `Using the chaos of the explosion and Daedalus's factory collapsing, you slip past the guards and make it directly to Kronos's inner sanctum.\n\nYou stand before the Titan Lord himself, but you're still battered from battle.`,
        choices: [
            { text: "⚔️ Channel your remaining strength for one final battle", next: 'finalBattle', health: -20 },
            { text: "🌊 Use the water pipes in the chamber as a weapon", next: 'waterWeapon', health: 0 },
            { text: "💨 Take a moment to recover before engaging", next: 'recoverBriefly', health: -10 }
        ]
    },
    
    acceptSacrifice: {
        text: `With Daedalus's help, you activate the ancient destruction sequence. The Labyrinth begins to collapse, and Kronos screams as his power source disintegrates.\n\nDaedalus is consumed by his creation as he finally achieves peace. The Labyrinth, Kronos's greatest tool, becomes his tomb.`,
        choices: [
            { text: "🏃 Escape the collapsing Labyrinth", next: 'escapeCollapse', health: -15 },
            { text: "⚔️ Finish Kronos while he's weakened", next: 'finishWeakKronos', health: -25 },
            { text: "📡 Ensure Camp Half-Blood knows victory is near", next: 'victoryNear', health: 0 }
        ]
    },
    
    refuseSacrifice: {
        text: `Daedalus is disappointed but understands. "Then we must find another way," he says.\n\nTogether, you devise an alternative plan to trap Kronos without destroying the Labyrinth. It's riskier, but potentially saves lives.`,
        choices: [
            { text: "🎯 Execute the new plan to trap Kronos", next: 'trapKronos', health: -20 },
            { text: "⚔️ Improve your trap with additional safeguards", next: 'improveTrap', health: -10 },
            { text: "🤝 Enlist allies to help execute the plan", next: 'getHelpTrap', health: 0 }
        ]
    },
    
    protectDaedalus: {
        text: `While protecting Daedalus from Kronos's forces, you mount a valiant defense. Your dedication impresses even the ancient inventor.\n\nTogether, you discover a way to turn off Kronos's power temporarily without destroying everything.`,
        choices: [
            { text: "⚡ Activate the power-off sequence immediately", next: 'powerOff', health: -15 },
            { text: "👁️ Wait for the perfect moment to activate it", next: 'perfectMoment', health: 0 },
            { text: "🎯 Use the sequence to trap rather than destroy", next: 'trap', health: -10 }
        ]
    },
    
    raceToKronos: {
        text: `You race through the chaos towards Kronos's location. Guards try to stop you, but you're too fast, too determined, too angry.\n\nYou burst into his presence before he can fully comprehend what's happened.`,
        choices: [
            { text: "⚡ Strike immediately with all your power", next: 'strikeAll', health: -20 },
            { text: "🗣️ Demand he surrender or die", next: 'surrender', health: 0 },
            { text: "👁️ Assess the situation before acting", next: 'assess', health: 0 }
        ]
    },
    
    findRebels: {
        text: `Among the chaos, you find resistance forces—demigods and creatures working against Kronos from within.\n\nWith their help, you coordinate a multi-pronged attack that catches Kronos completely off-guard.`,
        choices: [
            { text: "🪖 Lead them in a coordinated assault", next: 'coordinatedAssault2', health: -20 },
            { text: "⚔️ Use their support to reach Kronos yourself", next: 'reachKronos', health: -10 },
            { text: "📡 Combine your forces with Camp Half-Blood's incoming reinforcements", next: 'combinedForces', health: 0 }
        ]
    },
    
    retreat: {
        text: `You retreat and replan. The sabotage has weakened Kronos significantly, but he's still formidable.\n\nWith time to think, you devise a more strategic approach. You're ready for a calculated final confrontation.`,
        choices: [
            { text: "🎯 Plan a precision strike on Kronos's weak points", next: 'precisionStrike', health: 0 },
            { text: "🤝 Find allies for coordinated attack", next: 'findAlliesRetreat', health: 0 },
            { text: "💪 Prepare yourself physically and mentally", next: 'prepareMyselfFully', health: 0 }
        ]
    },
    
    continueTogether: {
        text: `With your friends' support, you feel stronger than ever. Together, you press toward Kronos's location with renewed hope and determination.\n\nYour bond as a team makes you nearly unstoppable.`,
        choices: [
            { text: "🤐 Sneak together to Kronos's chamber", next: 'teamSneak', health: 0 },
            { text: "⚔️ Charge together as one force", next: 'teamChargeKronos', health: -15 },
            { text: "🌊 Use combined powers for maximum effect", next: 'combinedPowers', health: 0 }
        ]
    },
    
    planWithFriends: {
        text: `Annabeth's strategic mind combines with your instincts and Grover's wisdom. Together, you devise a plan that accounts for Kronos's likely responses.\n\nYou have every advantage now—knowledge, allies, and preparation.`,
        choices: [
            { text: "✅ Execute the perfect plan", next: 'perfectPlan', health: -10 },
            { text: "⚔️ Execute with overwhelming force", next: 'perfectForce', health: -20 },
            { text: "🎯 Add Tyson's strength to the mix and attack", next: 'tysonHelps', health: -15 }
        ]
    },
    
    confrontKronosDirectly: {
        text: `You stride directly to Kronos, your companions right behind you. The Titan Lord rises, his scythe gleaming.\n\n"At last," he says. "I will finally end the prophecy by ending you."`,
        choices: [
            { text: "⚡ Attack with everything you have", next: 'attackEverything', health: -30 },
            { text: "🗣️ Engage him in a battle of wits before swords", next: 'battleWits', health: 0 },
            { text: "💪 Trust in your friends and launch coordinated attacks", next: 'coordinatedKronos', health: -20 }
        ]
    },
    
    powerAttack: {
        text: `You pour all your godly power into a devastating attack. Water explodes around you in massive waves, lightning crackles (borrowed from your stress), and you strike Kronos with the fury of the sea itself.\n\nThe Titan Lord is wounded, genuinely wounded, for the first time in ages. He roars in anger and pain.`,
        choices: [
            { text: "⚔️ Press the advantage immediately", next: 'pressAdvantage', health: -25 },
            { text: "💧 Drown him while he's weakened", next: 'drown', health: -20 },
            { text: "🎯 Go for the killing blow", next: 'killingBlow', health: -35 }
        ]
    },
    
    findWeakness: {
        text: `Kronos's confidence makes him careless. You observe him carefully and notice a pattern—his power fluctuates when he uses his scythe. That artifact is the source!\n\nIf you can separate him from it, you'll have a real chance.`,
        choices: [
            { text: "🗡️ Knock the scythe from his hands", next: 'knockScythe', health: -20 },
            { text: "💧 Destroy the scythe with water magic", next: 'destroyScythe', health: -15 },
            { text: "🧲 Trap the scythe with divine magic", next: 'trapScythe', health: 0 }
        ]
    },
    
    waterBattle: {
        text: `You summon water to flood the entire throne room. Kronos, stripped of his environmental advantages, is forced to fight in your element.\n\nYou've turned the battlefield to your advantage. The Titan Lord is not used to being outmaneuvered.`,
        choices: [
            { text: "🌊 Strike while he's disoriented", next: 'strikeDisoriented', health: -15 },
            { text: "💨 Drown him in the water", next: 'drownKronos', health: -20 },
            { text: "⚡ Attack from all angles using water currents", next: 'allAngles', health: -25 }
        ]
    },
    
    singleCombat: {
        text: `You face Kronos in pure melee combat. Sword against scythe, godly blood against ancient power.\n\nIt's the most intense battle of your life. Every moment is a dance of life and death, but your youth and determination are giving you an edge against his age and arrogance.`,
        choices: [
            { text: "⚔️ Fight to the very end", next: 'fightEnd', health: -50 },
            { text: "🎯 Finish him with a critical blow", next: 'criticalBlow', health: -40 },
            { text: "💪 Draw on Annabeth and Grover's support telepathically", next: 'supportTelepath', health: -30 }
        ]
    },
    
    getReinforcements: {
        text: `You call for backup from the monster forces you've turned against Kronos. The battle becomes chaotic as multiple factions clash.\n\nIn the confusion, you have opportunities to strike at Kronos.`,
        choices: [
            { text: "⚔️ Attack during the chaos", next: 'attackChaos', health: -15 },
            { text: "🎯 Sneak behind Kronos while he's distracted", next: 'sneakBehind', health: 0 },
            { text: "💪 Lead the rebellion against him", next: 'leadRebellion', health: -20 }
        ]
    },
    
    counterAttack: {
        text: `You escape and regroup. Kronos, thinking he's won, becomes overconfident. You devise a brilliant counter-attack that exploits his arrogance.\n\nWhen you strike, it's with perfect precision.`,
        choices: [
            { text: "⚡ Execute the counter-attack perfectly", next: 'perfectCounter', health: -10 },
            { text: "🎯 Use divine intervention for a critical strike", next: 'divineStrike', health: -15 },
            { text: "💪 Rally all remaining forces for the final assault", next: 'finalAssault', health: -25 }
        ]
    },
    
    surviveUntilReinforcements: {
        text: `No matter what Kronos throws at you, you survive. You dodge, block, and fight with everything you have. Your determination to see your friends again fuels you.\n\nEventually, Camp Half-Blood's forces arrive, thundering through the Labyrinth.`,
        choices: [
            { text: "💪 Combined with reinforcements, charge Kronos", next: 'chargeReinforced', health: -20 },
            { text: "🎯 Let the reinforcements handle him while you recover", next: 'letReinforcementsHandle', health: 0 },
            { text: "⚔️ Lead the final assault with your friends", next: 'leadFinal', health: -15 }
        ]
    },
    
    lastStand: {
        text: `You make a last stand in a narrow passage, your back against the wall. Kronos's forces surge at you in waves, but you hold the line.\n\nYour courage becomes legendary. You hold until reinforcements arrive. As they flood through, Kronos's forces begin to fall back.`,
        choices: [
            { text: "⚔️ Chase Kronos with the reinforcements", next: 'chaseKronos', health: 0 },
            { text: "🎯 Stand your ground and finish him here", next: 'finishHere', health: -20 },
            { text: "💪 Rest momentarily then coordinate the final attack", next: 'coordinateFinal', health: -10 }
        ]
    },
    
    escapeToCamp: {
        text: `You escape through the Labyrinth and meet the reinforcements from Camp Half-Blood at the entrance.\n\nWith fresh troops and restored hope, you regroup and prepare for the final assault with maximum advantage.`,
        choices: [
            { text: "🪖 Lead the reinforcements back into the Labyrinth", next: 'leadBack', health: -10 },
            { text: "📋 Strategize with the camp's leaders first", next: 'strategizeFirst', health: 0 },
            { text: "⚔️ Charge back immediately while momentum is on your side", next: 'chargeBack', health: -15 }
        ]
    },
    
    followCompanions: {
        text: `You follow the sounds of your friends and regroup in a safe chamber. Together again, your spirits soar.\n\nWith the wraith defeated and your team reunited, you feel nearly invincible.`,
        choices: [
            { text: "🎯 Head together toward Kronos's location", next: 'headsToKronos', health: 0 },
            { text: "📜 Plan the final assault as a united team", next: 'planFinalTeam', health: 0 },
            { text: "💪 Charge forward with combined strength", next: 'chargeForwardCombined', health: -10 }
        ]
    },
    
    navigateLab: {
        text: `With your confidence renewed from defeating the wraith, navigating the Labyrinth becomes easier. You can almost feel the turns in advance.\n\nYou reach Kronos's inner sanctum faster than expected.`,
        choices: [
            { text: "⚔️ Challenge him immediately", next: 'challengeImmediate', health: 0 },
            { text: "👁️ Observe him before attacking", next: 'observeKronos', health: 0 },
            { text: "🌊 Prepare the water chamber as your battlefield", next: 'prepareWater', health: 0 }
        ]
    },
    
    pressForward: {
        text: `Your unshakeable resolve drives you deeper into the Labyrinth. Nothing can stop you. Nothing will stop you.\n\nYou burst through the final gates and come face-to-face with Kronos himself.`,
        choices: [
            { text: "⚡ Attack immediately", next: 'attackKronosImmediate', health: -20 },
            { text: "🗣️ Confront him with words first", next: 'wordsFirst', health: 0 },
            { text: "💪 Draw on all your experiences to fight perfectly", next: 'perfightKronos', health: -25 }
        ]
    },
    
    teamSneakIn: {
        text: `Your team moves silently through the Labyrinth like ghosts. Annabeth's knowledge, Grover's senses, Tyson's strength, and your instincts work in perfect harmony.\n\nYou reach Kronos's chamber without alert. You have total surprise.`,
        choices: [
            { text: "⚡ Strike before he realizes you're there", next: 'strikeNoAlert', health: -15 },
            { text: "🎯 Position everyone perfectly before attacking", next: 'perfectPositions', health: 0 },
            { text: "🗣️ Confront him dramatically", next: 'dramaticConfrontation', health: 0 }
        ]
    },
    
    teamCharge: {
        text: `Your team charges into Kronos's chamber with unified fury. The Titan Lord rises, surprised by your combined assault.\n\nThe battle is intense but you have him outnumbered and outmaneuvered.`,
        choices: [
            { text: "⚔️ Focus all attacks on Kronos", next: 'focusAttacks', health: -25 },
            { text: "🎯 Each team member targets a weak point simultaneously", next: 'weakPoints', health: -20 },
            { text: "💪 Drive him into a trap you've set", next: 'trapSet', health: -15 }
        ]
    },
    
    optimalRoute: {
        text: `Following Annabeth's map, your team takes the optimal route through the Labyrinth. You avoid all traps and ambushes.\n\nYou arrive at Kronos's location with minimal damage, in perfect battle condition.`,
        choices: [
            { text: "⚔️ Attack with full force", next: 'fullForce', health: -20 },
            { text: "🎯 Execute the perfect tactical plan", next: 'tacticalPerfection', health: -15 },
            { text: "💪 Unleash coordinated divine power", next: 'coordinatedDivine', health: -25 }
        ]
    },
    
    waterMaster: {
        text: `Your water powers manifest in ways even you didn't know possible. Water becomes your ally, your weapon, your shield.\n\nYou feel like you've finally embraced your identity as a child of Poseidon fully.`,
        choices: [
            { text: "🌊 Use water to reach Kronos's location faster", next: 'waterFast', health: 0 },
            { text: "💪 Go directly to Kronos as the true master of water", next: 'trueMaster', health: 0 },
            { text: "⚡ Feel confident in challenging Kronos directly", next: 'confident', health: 0 }
        ]
    },
    
    findCompanions: {
        text: `You follow the traces of familiar presences and reunite with Annabeth, Grover, and Tyson.\n\nWith your team together and your water powers proven strong, you feel ready for anything.`,
        choices: [
            { text: "🎯 Head together to Kronos's location", next: 'togetherkronos', health: 0 },
            { text: "📜 Make a unified battle plan", next: 'unifiedPlan', health: 0 },
            { text: "⚔️ Charge together as one", next: 'chargeAsOne', health: 0 }
        ]
    },
    
    directToCronos: {
        text: `You head directly toward Kronos's location with utmost confidence. Your water mastery makes the journey easier.\n\nYou're about to face him, and you're ready.`,
        choices: [
            { text: "⚡ Challenge him to single combat", next: 'singleCombatDirectly', health: 0 },
            { text: "🌊 Prepare for water-based warfare", next: 'waterWar', health: 0 },
            { text: "💪 Unleash all your power at once", next: 'unleashAll', health: -20 }
        ]
    },
    
    // Victory routes
    activateBeacon: {
        text: `With your last ounce of strength, you activate the beacon. Suddenly, the camp knows where you are.\n\nMinutes later, help arrives. Medics rush to your side. You've made it. You survive, and with your survival, the camp's morale soars.`,
        choices: [
            { text: "💪 Join the final assault on Kronos with your friends", next: 'joinFinalAssault', health: 20 },
            { text: "📡 Recover while your allies finish the job", next: 'recoverWhileFinish', health: -20 },
        ]
    },
    
    finalPush: {
        text: `One final push. One last surge of strength. The exit is in sight. With a desperate cry, you drag yourself through the Labyrinth's threshold.\n\nYou collapse just outside, and moments later, Camp Half-Blood warriors find you. You're saved.`,
        choices: [
            { text: "💪 Share your knowledge to help the final assault", next: 'shareKnowledgeFinal', health: -10 },
            { text: "⚔️ Rise and join the battle one more time", next: 'riseAgain', health: -25 },
        ]
    },
    
    holdOn: {
        text: `You push past the pain, past the exhaustion, past everything. The will to survive burns like a beacon.\n\nAnd then you hear them—your friends! They've found you. You're going to make it!`,
        choices: [
            { text: "💪 Recover quickly and fight alongside your friends", next: 'recoverQuick', health: 15 },
            { text: "⚔️ Direct them in the final assault while you recover", next: 'directBattle', health: 0 },
        ]
    },
    
    lastHeal: {
        text: `You channel every remaining drop of your divine power. Water flows through you, mending wounds, knitting flesh, restoring life.\n\nWhen you finally stop, you're exhausted but alive. Help arrives moments later.`,
        choices: [
            { text: "⚔️ Now fully healed, charge toward the final battle", next: 'chargeHealed', health: 0 },
            { text: "💪 Rest briefly then join your allies", next: 'restThenJoin', health: 10 },
        ]
    },
    
    focusKronos: {
        text: `You focus on the main objective. Everything else fades away. Nothing matters except Kronos.\n\nYou navigate directly to his location with singular purpose.`,
        choices: [
            { text: "⚔️ Face him", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Use everything you've learned", next: 'useEverything', health: 20 },
        ]
    },
    
    findRealCompanions: {
        text: `You track down your real friends through the Labyrinth. When you find them, they embrace you with pure joy.\n\nUnited and stronger than ever, you move forward together.`,
        choices: [
            { text: "🤐 Sneak together to Kronos", next: 'sneakTogether', health: 0 },
            { text: "⚔️ Charge together", next: 'chargeTogether', health: -15 },
        ]
    },
    
    reportSuccess: {
        text: `You manage to send a message to Camp Half-Blood reporting your victory over the false creatures and Kronos's weakened state.\n\nReinforcements arrive shortly after, and with them, you have the strength to end this once and for all.`,
        choices: [
            { text: "⚔️ Lead reinforcements to final battle", next: 'leadReinforcements', health: -10 },
            { text: "💪 Let them handle cleanup while you face Kronos", next: 'faceKronosCleanup', health: 0 },
        ]
    },
    
    // Major final battles
    ultimateBattle: {
        text: `You stand before Kronos, the moment of ultimate truth. Neither of you says anything. There's no need.\n\nSwords clash. Power explodes. The ground trembles.\n\n✨ YOU DEFEATED KRONOS! ✨\n\nWith the Titan Lord fallen, his forces crumble. Camp Half-Blood is saved. You are a hero—not just to camp, but to the entire demigod world.`,
        choices: []
    },
    
    finishWeakKronos: {
        text: `Kronos, weakened by the Labyrinth's destruction and Daedalus's sacrifice, is vulnerable.\n\nYou strike true, one final blow. The Titan Lord falls.\n\n✨ VICTORY! ✨\n\nWith Kronos defeated and the Labyrinth destroyed, peace returns to the world. Your name will be sung for all time.`,
        choices: []
    },
    
    died: {
        text: `You close your eyes. The pain fades. Everything fades.\n\n☠️ YOU HAVE FALLEN ☠️\n\nYour sacrifice was not in vain, however. The information you gathered and the damage you caused helped others succeed where you could not. Though you did not see victory, you played a crucial role in it.\n\nYour legacy lives on in Camp Half-Blood.`,
        choices: [{ text: "Start Over", next: 'start', health: 0 }]
    },
    
    // Additional victory branches
    recoverQuick: {
        text: `With your friends' help, you recover quickly. Your demigod powers accelerate your healing.\n\nYou charge back into battle, and with your friends at your side, you cut through Kronos's forces like they're nothing.\n\n✨ KRONOS IS DEFEATED! ✨\n\nTogether, you are unstoppable. Victory is yours!`,
        choices: []
    },
    
    directBattle: {
        text: `From your position of safety, you direct your friends in a brilliant tactical assault. Each of their moves is perfectly coordinated.\n\nThey overwhelm Kronos completely.\n\n✨ VICTORY! ✨\n\nThough you didn't deliver the final blow, your strategic direction saved countless lives. You're hailed as a tactician and leader.`,
        choices: []
    },
    
    chargeHealed: {
        text: `Fully healed and powerful, you rejoin your friends in the final battle against Kronos.\n\nYour presence turns the tide completely. With you fighting at full strength, there's no way Kronos can stand.\n\n✨ KRONOS FALLS! ✨\n\nVictory is complete, and the world is saved!`,
        choices: []
    },
    
    restThenJoin: {
        text: `You rest just long enough to get your bearings, then join the battle at full strength.\n\nWith you in the fight, your friends rally. Together, you're unstoppable.\n\n✨ KRONOS IS DEFEATED! ✨\n\nPeace returns to the world, and your legend grows!`,
        choices: []
    },
    
    joinFinalAssault: {
        text: `Though battered, you join your friends in the final assault on Kronos's forces inside the Labyrinth.\n\nWith your knowledge of his fortress and your determination, you lead them to victory.\n\n✨ KRONOS DEFEATED! ✨\n\nThe world is saved, and you're a hero to all!`,
        choices: []
    },
    
    shareKnowledgeFinal: {
        text: `While you recover, you share all the knowledge you've gathered with Annabeth and the other commanders.\n\nThey use your information to orchestrate the perfect attack.\n\n✨ KRONOS FALLS! ✨\n\nYour tactical knowledge was the final piece needed for victory!`,
        choices: []
    },
    
    riseAgain: {
        text: `Despite your injuries, you rise. Your determination is absolute.\n\nYou join the final battle, and though you're weakened, your presence gives everyone courage.\n\n✨ KRONOS DEFEATED! ✨\n\nYour bravery earns you the respect of every warrior in camp!`,
        choices: []
    },
    
    useEverything: {
        text: `You use every skill, every power, every bit of knowledge you've gathered.\n\nYou are a warrior unlike any Kronos has faced. Despite his ancient power, you overwhelm him.\n\n✨ VICTORY! ✨\n\nKronos falls, and a new era of peace begins!`,
        choices: []
    },
    
    sneakTogether: {
        text: `Your team sneaks into Kronos's chamber undetected. Before he can even react, you strike.\n\n✨ KRONOS FALLS! ✨\n\nWith perfect coordination and the element of surprise, victory is swift and decisive!`,
        choices: []
    },
    
    chargeTogether: {
        text: `Your team charges into Kronos's chamber with unified fury. The Titan Lord is caught off-guard.\n\nTogether, you are unstoppable.\n\n✨ KRONOS DEFEATED! ✨\n\nVictory is yours, and you've earned the eternal gratitude of Camp Half-Blood!`,
        choices: []
    },
    
    chargeReinforced: {
        text: `With reinforcements at your back, you charge at Kronos together. He has nowhere to run.\n\n✨ KRONOS FALLS! ✨\n\nWith the combined might of Camp Half-Blood, the Titan Lord is defeated!`,
        choices: []
    },
    
    leadReinforcements: {
        text: `You lead the reinforcements to Kronos's location with absolute authority.\n\nTogether, overwhelming force destroys the Titan Lord completely.\n\n✨ VICTORY! ✨\n\nYou are hailed as the hero who saved the world!`,
        choices: []
    },

    faceKronosCleanup: {
        text: `While reinforcements clean up remaining forces, you face Kronos one final time.\n\nThis time, you're stronger, fresher, and knowing this is the end.\n\n✨ KRONOS DEFEATED! ✨\n\nThe world is saved by your hand!`,
        choices: []
    },

    singleCombatDirectly: {
        text: `You stand before Kronos, sword drawn, ready for one-on-one combat. The Titan Lord accepts your challenge with a grim smile.\n\nSwords clash in an epic battle. Your determination and youth against his ancient power.`,
        choices: [
            { text: "⚔️ Press every advantage you have", next: 'ultimateBattle', health: -30 },
            { text: "💪 Channel Poseidon's power for divine strength", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Use water control in the chamber", next: 'ultimateBattle', health: -20 }
        ]
    },

    waterWar: {
        text: `You prepare the throne chamber as your battlefield, filling it with water from hidden pools and magical fountains.\n\nKronos is at a disadvantage in your element. The water courses through your veins, but weakens his ancient form.`,
        choices: [
            { text: "💧 Drown him with overwhelming water", next: 'ultimateBattle', health: -20 },
            { text: "🌊 Use water currents to immobilize him", next: 'ultimateBattle', health: -25 },
            { text: "⚡ Strike while he's vulnerable", next: 'ultimateBattle', health: -15 }
        ]
    },

    unleashAll: {
        text: `You pour every ounce of your godly power into one final, catastrophic attack. The entire fortress shakes. Water explodes everywhere. Your divine heritage burns through your veins like lightning.\n\nIt's too much power, and it consumes you as much as it consumes him.`,
        choices: [
            { text: "💥 Annihilate Kronos completely", next: 'ultimateBattle', health: -40 },
            { text: "⚰️ Accept the mutual destruction", next: 'ultimateBattle', health: -50 }
        ]
    },

    togetherkronos: {
        text: `Your team heads together toward Kronos's location. With each step, you feel stronger. Your bond as friends and warriors is unbreakable.\n\nYou reach his inner sanctum ready for the final battle.`,
        choices: [
            { text: "🤐 Sneak in and strike together", next: 'sneakTogether', health: 0 },
            { text: "⚔️ Charge in as one unified force", next: 'chargeTogether', health: -15 },
            { text: "🎯 Use combined powers in coordinated attacks", next: 'coordinatedDivine', health: -20 }
        ]
    },

    unifiedPlan: {
        text: `You and your team make a unified battle plan. Annabeth handles strategy, Grover provides wisdom, Tyson offers strength, and you provide the final strike.\n\nTogether, you are unstoppable and perfectly coordinated.`,
        choices: [
            { text: "🎯 Execute the perfect plan", next: 'perfectPlan', health: -10 },
            { text: "⚔️ Execute with maximum force", next: 'perfectForce', health: -20 },
            { text: "💪 Trust in each other completely", next: 'teamChargeKronos', health: -15 }
        ]
    },

    chargeAsOne: {
        text: `Your team charges into Kronos's chamber as one unified force. The synchronization of your movements is perfect. You move like a single warrior split across four brilliant minds.\n\nKronos stands against impossible odds.`,
        choices: [
            { text: "⚔️ Focus fire on the Titan Lord", next: 'ultimateBattle', health: -25 },
            { text: "🎯 Strike at his weak points simultaneously", next: 'ultimateBattle', health: -20 },
            { text: "💪 Let Tyson lead the charge", next: 'ultimateBattle', health: -15 }
        ]
    },

    trueMaster: {
        text: `You stride toward Kronos as the true master of water. Your power is immense and absolute. The Labyrinth itself seems to acknowledge your mastery.\n\nYou reach his chamber ready to end this.`,
        choices: [
            { text: "💧 Flood the chamber and fight in your element", next: 'ultimateBattle', health: -20 },
            { text: "🌊 Summon all available water for one final attack", next: 'ultimateBattle', health: -25 },
            { text: "⚡ Face him directly with absolute confidence", next: 'ultimateBattle', health: -15 }
        ]
    },

    confident: {
        text: `You stride toward Kronos with absolute confidence. Nothing can stop you now. You've overcome every obstacle, defeated every enemy, and mastered your powers.\n\nYou are ready.`,
        choices: [
            { text: "⚔️ Challenge him to final combat", next: 'ultimateBattle', health: -25 },
            { text: "💪 Attack without hesitation", next: 'ultimateBattle', health: -20 },
            { text: "🌊 Unleash your full potential", next: 'ultimateBattle', health: -30 }
        ]
    },

    waterFast: {
        text: `You use water currents to travel faster through the Labyrinth. The streams of water carry you at incredible speed toward Kronos's location.\n\nYou arrive before he knows what's coming.`,
        choices: [
            { text: "⚡ Attack immediately while he's surprised", next: 'ultimateBattle', health: -20 },
            { text: "🎯 Prepare for the final battle", next: 'ultimateBattle', health: -15 }
        ]
    },

    planFinal: {
        text: `You take time to plan your final attack to Kronos carefully. You analyze his patterns, his weaknesses, his strategies.\n\nWhen you finally confront him, you're perfectly prepared.`,
        choices: [
            { text: "🎯 Execute your perfect plan", next: 'ultimateBattle', health: -15 },
            { text: "⚔️ Strike with absolute precision", next: 'ultimateBattle', health: -20 },
            { text: "💪 Trust in your preparation", next: 'ultimateBattle', health: -10 }
        ]
    },

    gatherMorePower: {
        text: `You continue deeper into the Labyrinth, seeking every source of power. Ancient artifacts, magical chambers, and divine blessings strengthen you.\n\nWhen you finally face Kronos, you're at your absolute peak.`,
        choices: [
            { text: "⚡ Unleash all your gathered power", next: 'ultimateBattle', health: -20 },
            { text: "💪 Feel the power coursing through you", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Master all the elements you've learned", next: 'ultimateBattle', health: -15 }
        ]
    },

    faceAlone: {
        text: `Despite being alone, your determination is unshakeable. You face Kronos solo—just you, your sword, and your godly power.\n\nIt's time to end this.`,
        choices: [
            { text: "⚔️ Fight alone with all your might", next: 'ultimateBattle', health: -35 },
            { text: "💪 Draw on memories of your friends for strength", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Let your anger fuel your power", next: 'ultimateBattle', health: -25 }
        ]
    },

    headsToKronos: {
        text: `You and your team head together toward Kronos's location. The anticipation builds with each step. You're ready. Together, you're unstoppable.`,
        choices: [
            { text: "🤐 Enter quietly and strike", next: 'teamSneakIn', health: 0 },
            { text: "⚔️ Charge in with fury", next: 'teamCharge', health: -10 },
            { text: "🎯 Use a coordinated tactical approach", next: 'optimalRoute', health: 0 }
        ]
    },

    planFinalTeam: {
        text: `Your team gathers to plan the final assault. Annabeth strategizes, Grover offers wisdom, Tyson provides strength insights, and you offer tactical direction.\n\nTogether, you devise the perfect plan.`,
        choices: [
            { text: "✅ Execute the plan perfectly", next: 'perfectPlan', health: -10 },
            { text: "⚔️ Execute with overwhelming force", next: 'perfectForce', health: -20 },
            { text: "🎯 Add divine intervention to the plan", next: 'coordinatedDivine', health: -20 }
        ]
    },

    chargeForwardCombined: {
        text: `Your team charges forward with combined strength. Each of you brings unique abilities and powers. Together, you're a force of nature.\n\nKronos will fall to your unified might.`,
        choices: [
            { text: "⚔️ Focus all attacks on him", next: 'ultimateBattle', health: -25 },
            { text: "💪 Overwhelm him with numbers and power", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Let Percy lead the final strike", next: 'ultimateBattle', health: -20 }
        ]
    },

    prepareMyselfFully: {
        text: `You take time to prepare yourself fully—physically, mentally, and spiritually. You meditate, you train, you draw power from the very earth.\n\nWhen you face Kronos, you're a perfectly honed weapon.`,
        choices: [
            { text: "⚡ Strike with perfect technique", next: 'ultimateBattle', health: -15 },
            { text: "💪 Channel all your preparation into one attack", next: 'ultimateBattle', health: -20 },
            { text: "🌊 Feel completely ready", next: 'ultimateBattle', health: -10 }
        ]
    },

    findAlliesRetreat: {
        text: `You retreat and search for allies—creatures, demigods, and forces that oppose Kronos. You build a coalition.\n\nWith them at your side, you prepare for the final assault.`,
        choices: [
            { text: "🪖 Lead them in coordinated attack", next: 'coordinatedAssault2', health: -20 },
            { text: "⚔️ Use them as backup for your direct strike", next: 'ultimateBattle', health: -20 },
            { text: "📡 Combine forces with Camp Half-Blood", next: 'combinedForces', health: 0 }
        ]
    },

    recoverWhileFinish: {
        text: `You recover under the care of medics while your allies finish the job. Though it pains you to sit this out, your team is capable.\n\nAs Kronos falls, you know you played your part.`,
        choices: []
    },

    searchPower: {
        text: `You search frantically through Kronos's fortress for the source of his power. You find an ancient artifact—a phylactery glowing with dark energy.\n\nIt's the key to his immortality. If you destroy it, Kronos will be vulnerable.`,
        choices: [
            { text: "💣 Destroy the artifact immediately", next: 'ultimateBattle', health: -20 },
            { text: "⚔️ Use the discovery to confront Kronos", next: 'ultimateBattle', health: -25 },
            { text: "📡 Report it to your allies for backup", next: 'reportFindings', health: 0 }
        ]
    },

    weakMomentAttack: {
        text: `You watch Kronos carefully and wait for his moment of weakness. When his power fluctuates, you strike with all your might.\n\nYour attack lands true, wounding the Titan Lord!`,
        choices: [
            { text: "⚔️ Press the advantage immediately", next: 'ultimateBattle', health: -20 },
            { text: "💧 Drown him while he's weakened", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Strike again before he recovers", next: 'ultimateBattle', health: -15 }
        ]
    },

    reportFindings: {
        text: `You escape from Kronos's throne room and report your findings to your allies. They're grateful for the intelligence.\n\nWith this knowledge, you plan the perfect counter-attack.`,
        choices: [
            { text: "🎯 Lead the coordinated strike with your team", next: 'ultimateBattle', health: -25 },
            { text: "💪 Return alone to destroy what you found", next: 'ultimateBattle', health: -30 },
            { text: "⚔️ Combine forces for a unified assault", next: 'ultimateBattle', health: -20 }
        ]
    },

    seekKronos: {
        text: `You seek out Kronos with single-minded purpose. Nothing will stop you. Nothing will slow you.\n\nYou find him, and it's time to end this.`,
        choices: [
            { text: "⚡ Attack immediately", next: 'ultimateBattle', health: -20 },
            { text: "💪 Challenge him to final combat", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Unleash all your power", next: 'ultimateBattle', health: -30 }
        ]
    },

    reuniteCompanions: {
        text: `You find your companions in a safe chamber. Annabeth, Grover, and Tyson embrace you with joy. Together again, you feel invincible.`,
        choices: [
            { text: "🤐 Plan the final assault together", next: 'coordinatedAssault', health: 0 },
            { text: "⚔️ Charge toward Kronos as one", next: 'chargeAsOne', health: -15 },
            { text: "💪 Draw strength from your reunion", next: 'chargeForwardCombined', health: -10 }
        ]
    },

    searchKnowledge: {
        text: `You search the Labyrinth for ancient knowledge about Kronos. You find inscriptions and texts revealing his weaknesses.\n\nArmed with this knowledge, you're ready to face him.`,
        choices: [
            { text: "🎯 Use the knowledge tactically", next: 'ultimateBattle', health: -15 },
            { text: "💪 Feel confident with this information", next: 'ultimateBattle', health: -10 },
            { text: "⚔️ Head directly to Kronos", next: 'ultimateBattle', health: -20 }
        ]
    },

    precisionStrike: {
        text: `You plan a precision strike on Kronos's weak points. Every detail is carefully considered. When you strike, it's perfectly executed.`,
        choices: [
            { text: "🎯 Execute the strike flawlessly", next: 'ultimateBattle', health: -15 },
            { text: "⚔️ Overwhelm him with precision", next: 'ultimateBattle', health: -20 },
            { text: "💪 Trust in your tactical knowledge", next: 'ultimateBattle', health: -10 }
        ]
    },

    destroyLabyrinth: {
        text: `You systematically destroy the Labyrinth itself. With each passage destroyed, you feel Kronos weaken. He's tied to this ancient structure!\n\nYour strategy is working.`,
        choices: [
            { text: "💣 Destroy more of the Labyrinth", next: 'ultimateBattle', health: -25 },
            { text: "🎯 Go directly to Kronos now", next: 'ultimateBattle', health: -20 },
            { text: "💪 Complete the destruction", next: 'ultimateBattle', health: -30 }
        ]
    },

    attackAndDestroy: {
        text: `You attack Kronos while deliberately destroying the Labyrinth passages around him. Each destruction weakens him further.\n\nYour strategy is brilliant—he's both weakened and cornered.`,
        choices: [
            { text: "⚔️ Press the attack", next: 'ultimateBattle', health: -20 },
            { text: "💣 Destroy more passages", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Use water for structural damage", next: 'ultimateBattle', health: -15 }
        ]
    },

    shareKnowledge: {
        text: `You share your discovered knowledge about the Labyrinth's connection to Kronos with your allies.\n\nTogether, you devise a plan to exploit this weakness on a massive scale.`,
        choices: [
            { text: "🪖 Lead a coordinated strike", next: 'coordinatedAssault', health: -20 },
            { text: "📋 Plan the perfect assault", next: 'multiProngedAttack', health: 0 },
            { text: "⚔️ Attack while they distract him", next: 'useDiversion', health: -15 }
        ]
    },

    perfectPositions: {
        text: `Your team positions themselves perfectly around Kronos. Every angle is covered. Every weak point is targeted.\n\nKronos doesn't know what's about to hit him.`,
        choices: [
            { text: "⚔️ Strike from all sides", next: 'ultimateBattle', health: -25 },
            { text: "🎯 Execute the perfect coordinated strike", next: 'ultimateBattle', health: -20 },
            { text: "💪 Trust in the perfect positioning", next: 'ultimateBattle', health: -15 }
        ]
    },

    dramaticConfrontation: {
        text: `You step forward dramatically and confront Kronos face-to-face. Your words challenge him. Your presence defies him.\n\n"I'm Percy Jackson," you declare. "And I'm ending this."`,
        choices: [
            { text: "⚡ Attack with your declaration", next: 'ultimateBattle', health: -20 },
            { text: "⚔️ Let your actions back your words", next: 'ultimateBattle', health: -25 },
            { text: "💪 Fight with righteous fury", next: 'ultimateBattle', health: -30 }
        ]
    },

    focusAttacks: {
        text: `Your entire team focuses all attacks on Kronos. He's overwhelmed by the coordinated assault.\n\nHe's never faced this level of unified force before.`,
        choices: [
            { text: "⚔️ Continue the focused assault", next: 'ultimateBattle', health: -20 },
            { text: "💪 Add your power to theirs", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Go for the killing blow", next: 'ultimateBattle', health: -30 }
        ]
    },

    weakPoints: {
        text: `Your team targets Kronos's weak points simultaneously. Annabeth hits his strategic weaknesses, Grover disrupts his power, Tyson strikes physically, and you strike with water power.\n\nHe crumbles under the perfect assault.`,
        choices: [
            { text: "⚔️ Finish him together", next: 'ultimateBattle', health: -20 },
            { text: "💪 You deliver the final blow", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Use combined power for victory", next: 'ultimateBattle', health: -30 }
        ]
    },

    trapSet: {
        text: `Your team has set a trap for Kronos. When he enters, the trap springs shut perfectly.\n\nHe's caught, weakened, and about to fall.`,
        choices: [
            { text: "⚔️ Strike while he's trapped", next: 'ultimateBattle', health: -15 },
            { text: "🎯 Spring the trap for maximum effect", next: 'ultimateBattle', health: -20 },
            { text: "💪 Deliver the final blow", next: 'ultimateBattle', health: -25 }
        ]
    },

    fullForce: {
        text: `You attack Kronos with full force. Every power, every skill, every ounce of strength you possess is unleashed in a devastating assault.\n\nHe staggers back, genuinely wounded.`,
        choices: [
            { text: "⚔️ Press the advantage", next: 'ultimateBattle', health: -20 },
            { text: "💪 Continue with full force", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Go for the killing blow", next: 'ultimateBattle', health: -30 }
        ]
    },

    tacticalPerfection: {
        text: `You execute a tactically perfect plan. Every move is calculated. Every strategy accounts for his counters.\n\nKronos finds himself outmaneuvered at every turn.`,
        choices: [
            { text: "⚔️ Exploit the tactical advantage", next: 'ultimateBattle', health: -15 },
            { text: "🎯 Execute the final phase perfectly", next: 'ultimateBattle', health: -20 },
            { text: "💪 Trust your perfect tactics", next: 'ultimateBattle', health: -10 }
        ]
    },

    coordinatedDivine: {
        text: `You and your team unleash coordinated divine power. Your godly heritage burns bright. Together, you are a force of nature.\n\nKronos has never faced anything like this.`,
        choices: [
            { text: "⚡ Strike with divine power", next: 'ultimateBattle', health: -25 },
            { text: "💪 Overwhelm him with divinity", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Finish him with your combined power", next: 'ultimateBattle', health: -35 }
        ]
    },

    coordinatedAssault2: {
        text: `The rebels and you launch a coordinated assault. From multiple directions, with multiple strategies, Kronos is surrounded.\n\nHe cannot escape. He cannot defend. He can only fall.`,
        choices: [
            { text: "⚔️ Press the assault", next: 'ultimateBattle', health: -20 },
            { text: "🎯 Lead the final push", next: 'ultimateBattle', health: -25 },
            { text: "💪 Overwhelm him completely", next: 'ultimateBattle', health: -30 }
        ]
    },

    multiProngedAttack: {
        text: `You plan a strategic multi-pronged attack. Diversions create chaos, allies attack from different angles, and you deliver the critical strike.\n\nKronos has no idea what's coming.`,
        choices: [
            { text: "🎯 Execute the multi-pronged strategy", next: 'ultimateBattle', health: -20 },
            { text: "💪 Lead from the front", next: 'ultimateBattle', health: -25 },
            { text: "⚔️ Overwhelm him from all sides", next: 'ultimateBattle', health: -30 }
        ]
    },

    useDiversion: {
        text: `Your allies create a massive diversion while you slip into position for the critical strike.\n\nKronos is so focused on the diversion, he doesn't see you coming.`,
        choices: [
            { text: "⚡ Strike from the shadows", next: 'ultimateBattle', health: -15 },
            { text: "🎯 Deliver the critical blow", next: 'ultimateBattle', health: -20 },
            { text: "💪 Finish him while distracted", next: 'ultimateBattle', health: -25 }
        ]
    },

    combinedForces: {
        text: `You combine your forces with Camp Half-Blood's full might. Warriors, demigods, and magical creatures work with you in unified assault.\n\nKronos faces an army, led by you.`,
        choices: [
            { text: "🪖 Lead them to victory", next: 'ultimateBattle', health: -25 },
            { text: "⚔️ Overwhelm the Titan Lord", next: 'ultimateBattle', health: -30 },
            { text: "💪 Strike together for victory", next: 'ultimateBattle', health: -35 }
        ]
    },

    fightEnd: {
        text: `You fight Kronos until the very end. It's the most intense combat of your life. Every hit is a dance between life and death.\n\nBut in the end, your youth and determination overcome his ancient power.`,
        choices: [
            { text: "⚔️ Deliver the final blow", next: 'ultimateBattle', health: -40 },
            { text: "💪 Overcome him through sheer will", next: 'ultimateBattle', health: -50 },
            { text: "🌊 Drown him in your determination", next: 'ultimateBattle', health: -45 }
        ]
    },

    criticalBlow: {
        text: `You find the perfect opening, the perfect moment, and deliver a critical blow directly to Kronos's heart.\n\nHe staggers, knowing he's beaten.`,
        choices: [
            { text: "⚔️ Finish him", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Drown the titan", next: 'ultimateBattle', health: -25 },
            { text: "💪 End this once and for all", next: 'ultimateBattle', health: -20 }
        ]
    },

    supportTelepath: {
        text: `Through an unspoken bond, you feel Annabeth's strategic guidance, Grover's calming wisdom, and Tyson's encouraging strength.\n\nTogether, even separated, you are one force.`,
        choices: [
            { text: "⚔️ Fight with their support", next: 'ultimateBattle', health: -30 },
            { text: "💪 Overcome Kronos with their help", next: 'ultimateBattle', health: -35 },
            { text: "🌊 Victory is assured with them", next: 'ultimateBattle', health: -25 }
        ]
    },

    attackChaos: {
        text: `You attack during the chaos. Multiple factions clash, creating the perfect opportunity.\n\nYour strike lands true, weakening Kronos significantly.`,
        choices: [
            { text: "⚔️ Keep attacking", next: 'ultimateBattle', health: -15 },
            { text: "💪 Go for a killing blow", next: 'ultimateBattle', health: -20 },
            { text: "🌊 End him now", next: 'ultimateBattle', health: -25 }
        ]
    },

    sneakBehind: {
        text: `You sneak behind Kronos while he's distracted by the rebellion. You're right at his back, weapon ready.\n\nThis is your moment.`,
        choices: [
            { text: "⚡ Strike from behind with maximum force", next: 'ultimateBattle', health: -20 },
            { text: "💪 Drive your weapon through him", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Drown him from behind", next: 'ultimateBattle', health: -15 }
        ]
    },

    leadRebellion: {
        text: `You lead the rebellion forces against Kronos with absolute authority. They follow your commands as one.\n\nTogether, you are an unstoppable force.`,
        choices: [
            { text: "🪖 Lead the final assault", next: 'ultimateBattle', health: -25 },
            { text: "⚔️ Command them to victory", next: 'ultimateBattle', health: -30 },
            { text: "💪 Strike together", next: 'ultimateBattle', health: -20 }
        ]
    },

    perfectCounter: {
        text: `Your counter-attack is executed perfectly. Every move exploits his arrogance. Every blow is calculated.\n\nHe realizes too late that he's walked into your trap.`,
        choices: [
            { text: "⚔️ Spring the trap", next: 'ultimateBattle', health: -10 },
            { text: "💪 Overwhelm him", next: 'ultimateBattle', health: -15 },
            { text: "🌊 Finish him", next: 'ultimateBattle', health: -20 }
        ]
    },

    divineStrike: {
        text: `You channel your father's divine power into one critical strike. Green energy explodes around you. You are Poseidon's wrath incarnate.\n\nKronos staggers from the blow.`,
        choices: [
            { text: "⚔️ Follow up with another strike", next: 'ultimateBattle', health: -15 },
            { text: "💪 Overwhelm him with divinity", next: 'ultimateBattle', health: -20 },
            { text: "🌊 Finish him with divine power", next: 'ultimateBattle', health: -25 }
        ]
    },

    finalAssault: {
        text: `You rally every remaining force and launch the final assault. This is it. This is the moment that will decide everything.\n\nEverything has led to this.`,
        choices: [
            { text: "⚔️ Give it everything", next: 'ultimateBattle', health: -25 },
            { text: "💪 Victory or death", next: 'ultimateBattle', health: -30 },
            { text: "🌊 End this now", next: 'ultimateBattle', health: -35 }
        ]
    },

    chargeKronos: {
        text: `You charge at Kronos with your sword raised high. The moment has come. All your training, all your power, all your courage culminates in this charge.`,
        choices: [
            { text: "⚔️ Strike true", next: 'ultimateBattle', health: -25 },
            { text: "💪 Overwhelm him", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Drown the titan", next: 'ultimateBattle', health: -20 }
        ]
    },

    chaseKronos: {
        text: `You chase Kronos through the reinforcements, not giving him a moment to breathe, to rest, or to counter-attack.\n\nHe's cornered and defeated.`,
        choices: [
            { text: "⚔️ Finish him", next: 'ultimateBattle', health: -20 },
            { text: "💪 Strike the final blow", next: 'ultimateBattle', health: -25 },
            { text: "🌊 End his reign of terror", next: 'ultimateBattle', health: -30 }
        ]
    },

    finishHere: {
        text: `You stand over Kronos, weakened and defeated. This is your moment. This is where his reign of terror ends.`,
        choices: [
            { text: "⚔️ Strike him down", next: 'ultimateBattle', health: -20 },
            { text: "💪 End this", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Finish the Titan Lord", next: 'ultimateBattle', health: -15 }
        ]
    },

    coordinateFinal: {
        text: `You coordinate with your reinforcements for the final attack. Everyone knows their role. Everyone is ready.\n\nYou attack as one unified force.`,
        choices: [
            { text: "🪖 Leading the coordinated strike", next: 'ultimateBattle', health: -25 },
            { text: "⚔️ Strike together", next: 'ultimateBattle', health: -20 },
            { text: "💪 Overwhelm him together", next: 'ultimateBattle', health: -30 }
        ]
    },

    leadBack: {
        text: `You lead the reinforcements back into the Labyrinth. With fresh troops and your knowledge of the terrain, you move toward Kronos.\n\nVictory is within reach.`,
        choices: [
            { text: "🪖 Strike together", next: 'ultimateBattle', health: -20 },
            { text: "⚔️ Lead the assault", next: 'ultimateBattle', health: -25 },
            { text: "💪 Finish Kronos", next: 'ultimateBattle', health: -30 }
        ]
    },

    strategizeFirst: {
        text: `You gather the camp's leaders and strategize before continuing. Together, you develop the perfect Counter-attack plan.\n\nYou're ready.`,
        choices: [
            { text: "🎯 Execute the perfect plan", next: 'ultimateBattle', health: -15 },
            { text: "🪖 Lead with the reinforcements", next: 'ultimateBattle', health: -20 },
            { text: "⚔️ Attack with perfect strategy", next: 'ultimateBattle', health: -25 }
        ]
    },

    chargeBack: {
        text: `Momentum is on your side. You charge back into the Labyrinth with reinforcements at your back.\n\nKronos will not escape this time.`,
        choices: [
            { text: "⚔️ Strike with full force", next: 'ultimateBattle', health: -20 },
            { text: "💪 Overwhelm him together", next: 'ultimateBattle', health: -25 },
            { text: "🎯 Execute the final blow", next: 'ultimateBattle', health: -30 }
        ]
    },

    justSurrender: {
        text: `Without any ceremony or battle, you demand Kronos simply give up.\n\n"Never," he snarls. Combat is inevitable.`,
        choices: [
            { text: "⚔️ Engage in combat", next: 'ultimateBattle', health: -25 },
            { text: "💪 Force his surrender", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Attack after refusal", next: 'ultimateBattle', health: -20 }
        ]
    },

    chargeAsOne: {
        text: `Your team charges toward Kronos as one united force. Together, you're unstoppable.\n\nKronos has no chance.`,
        choices: [
            { text: "⚔️ Strike together", next: 'ultimateBattle', health: -20 },
            { text: "💪 Overwhelm him", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Victory", next: 'ultimateBattle', health: -30 }
        ]
    },

    chargeForwardCombined: {
        text: `Combined with your companions, your power feels doubled, tripled, infinite.\n\nYou charge forward ready to end this.`,
        choices: [
            { text: "⚔️ Strike with combined might", next: 'ultimateBattle', health: -25 },
            { text: "💪 Overwhelm Kronos", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Final victory", next: 'ultimateBattle', health: -35 }
        ]
    },

    planFinalTeam: {
        text: `Your team plans the perfect final assault. Strategy, power, knowledge, and teamwork combine.\n\nVictory is as good as assured.`,
        choices: [
            { text: "✅ Execute the plan", next: 'ultimateBattle', health: -20 },
            { text: "⚔️ Attack as planned", next: 'ultimateBattle', health: -25 },
            { text: "💪 Strike with perfect coordination", next: 'ultimateBattle', health: -30 }
        ]
    },

    confrontDirect: {
        text: `You confront Kronos directly, your team at your side. No hesitation. No doubt. Only purpose.`,
        choices: [
            { text: "⚔️ Attack", next: 'ultimateBattle', health: -25 },
            { text: "💪 Strike", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Victory", next: 'ultimateBattle', health: -20 }
        ]
    },

    executePerfect: {
        text: `You execute the rescue plan flawlessly. Not a single mistake. The prisoners are free and grateful.\n\nThey join you against Kronos.`,
        choices: [
            { text: "🤝 March together to Kronos", next: 'marchTogether', health: 0 },
            { text: "📜 Plan together", next: 'battlePlan', health: 0 },
            { text: "⚔️ Charge immediately", next: 'chargeMomentum', health: -15 }
        ]
    },

    executeForce: {
        text: `You execute the rescue with overwhelming force. It's fast, brutal, and effective.\n\nThe prisoners are free, and the guards are defeated. But you've made noise.`,
        choices: [
            { text: "🏃 Leave quickly", next: 'marchTogether', health: -10 },
            { text: "⚔️ Charge toward Kronos", next: 'chargeMomentum', health: -15 },
            { text: "🤐 Regroup quietly", next: 'battlePlan', health: -5 }
        ]
    },

    directAttackKronos: {
        text: `Using the prisoners' knowledge, you attack Kronos directly. You bypass his defenses entirely.\n\nHe wasn't expecting this.`,
        choices: [
            { text: "⚔️ Strike hard", next: 'ultimateBattle', health: -20 },
            { text: "💪 Finish him", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Victory", next: 'ultimateBattle', health: -30 }
        ]
    },

    marchTogether: {
        text: `You and the freed prisoners march toward Kronos's location together. Your forces are growing stronger.\n\nKronos will not know what hit him.`,
        choices: [
            { text: "⚔️ Attack together", next: 'ultimateBattle', health: -20 },
            { text: "💪 Overwhelm him", next: 'ultimateBattle', health: -25 },
            { text: "🎯 Execute perfectly", next: 'ultimateBattle', health: -30 }
        ]
    },

    battlePlan: {
        text: `You make a coordinated battle plan with the freed prisoners. Each of you knows your role. Everything is calculated.\n\nVictory is almost certain.`,
        choices: [
            { text: "✅ Execute the plan", next: 'ultimateBattle', health: -15 },
            { text: "⚔️ Attack with confidence", next: 'ultimateBattle', health: -20 },
            { text: "💪 Overwhelm Kronos", next: 'ultimateBattle', health: -25 }
        ]
    },

    chargeMomentum: {
        text: `With momentum on your side, you charge toward Kronos. Your combined forces are a wave of destruction.\n\nNothing can stop you.`,
        choices: [
            { text: "⚔️ Strike with momentum", next: 'ultimateBattle', health: -20 },
            { text: "💪 Overwhelm him", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Victory", next: 'ultimateBattle', health: -30 }
        ]
    },

    tysonHelps: {
        text: `Tyson's Cyclops strength combines with your power. Together, you deliver a devastating assault that Kronos cannot withstand.\n\nHe staggers, defeated.`,
        choices: [
            { text: "⚔️ Strike together", next: 'ultimateBattle', health: -20 },
            { text: "💪 Finish him with Tyson's help", next: 'ultimateBattle', health: -25 },
            { text: "🌊 Victory together", next: 'ultimateBattle', health: -15 }
        ]
    },

    acceptAlliance: {
        text: `You accept the Nereids' alliance fully. They pledge their power to your cause.\n\nWith them, you feel the strength of the seas itself.`,
        choices: [
            { text: "🌊 Use their power", next: 'ultimateBattle', health: 5 },
            { text: "⚔️ Head to Kronos", next: 'ultimateBattle', health: -15 },
            { text: "💪 Together you are unstoppable", next: 'ultimateBattle', health: -20 }
        ]
    },

    getDirection: {
        text: `The Nereids point you toward Kronos's location. With their guidance, you navigate directly to him.\n\nYou arrive ready for the final confrontation.`,
        choices: [
            { text: "⚔️ Challenge him", next: 'ultimateBattle', health: -25 },
            { text: "💪 Strike immediately", next: 'ultimateBattle', health: -30 },
            { text: "🌊 Victory is near", next: 'ultimateBattle', health: -20 }
        ]
    },

    joinBattle: {
        text: `The Nereids join you in battle against Kronos. Together, you fight with the power of the seas.\n\nVictory is yours.`,
        choices: [
            { text: "🌊 Strike with the Nereids", next: 'ultimateBattle', health: -20 },
            { text: "⚔️ Final assault", next: 'ultimateBattle', health: -25 },
            { text: "💪 Overwhelming victory", next: 'ultimateBattle', health: -30 }
        ]
    },

    amplifyPowers: {
        text: `The Nereids amplify your water powers with their ancient magic. You are stronger now than ever before.\n\nYou are a force of pure water magic.`,
        choices: [
            { text: "💧 Strike with amplified power", next: 'ultimateBattle', health: -15 },
            { text: "🌊 Drown the Titan Lord", next: 'ultimateBattle', health: -20 },
            { text: "⚔️ End him", next: 'ultimateBattle', health: -25 }
        ]
    },

    strikeUnprepared: {
        text: `You strike at Kronos while he's unprepared. Your assault is devastating.\n\nHe staggers back, shocked by your power and the Nereids' aid.`,
        choices: [
            { text: "⚔️ Press the advantage", next: 'ultimateBattle', health: -10 },
            { text: "💪 Overwhelm him", next: 'ultimateBattle', health: -15 },
            { text: "🌊 Finish him", next: 'ultimateBattle', health: -20 }
        ]
    },

    confrontWithNereids: {
        text: `You confront Kronos with the Nereids at your side. Together, you are magnificent and powerful.\n\nKronos faces the combined might of the seas.`,
        choices: [
            { text: "⚔️ Strike together", next: 'ultimateBattle', health: -20 },
            { text: "🌊 Drown him together", next: 'ultimateBattle', health: -25 },
            { text: "💪 Victory is assured", next: 'ultimateBattle', health: -30 }
        ]
    }
};

const sceneAliases = {
    escapeUseChoas: 'escapeToCamp',
    reportSuccess2: 'reportSuccess',
    perfightKronos: 'ultimateBattle',
    teamSneak: 'teamSneakIn',
    justSurrender: 'surrender',
    confrontDirect: 'confrontKronosDirectly'
};

function resolveSceneId(sceneId) {
    if (scenes[sceneId]) {
        return sceneId;
    }

    const aliasSceneId = sceneAliases[sceneId];
    if (aliasSceneId && scenes[aliasSceneId]) {
        return aliasSceneId;
    }

    if (scenes.ultimateBattle) {
        return 'ultimateBattle';
    }

    return 'start';
}


function displayScene(sceneId) {
    const resolvedSceneId = resolveSceneId(sceneId);
    const scene = scenes[resolvedSceneId];

    if (resolvedSceneId !== sceneId) {
        console.warn('Missing scene resolved:', sceneId, '->', resolvedSceneId);
        currentSceneId = resolvedSceneId;
    }

    if (!scene) {
        console.error('Scene not found:', resolvedSceneId);
        return;
    }
    
    const storyText = document.getElementById('storyText');
    const choicesContainer = document.getElementById('choicesContainer');
    
    storyText.style.color = '';
    storyText.textContent = scene.text;
    choicesContainer.innerHTML = '';
    
    if (scene.choices && scene.choices.length > 0) {
        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.onclick = () => {
                playerHealth = Math.max(0, Math.min(100, playerHealth + choice.health));
                updateHealthBar();
                
                if (playerHealth <= 0) {
                    currentSceneId = 'died';
                    gameActive = false;
                } else if (choice.next === 'died') {
                    currentSceneId = choice.next;
                    gameActive = false;
                } else {
                    currentSceneId = choice.next;
                }
                
                displayScene(currentSceneId);
            };
            choicesContainer.appendChild(button);
        });
    } else {
        // Game ended
        gameActive = false;
        if (sceneId.includes('dead') || sceneId === 'died') {
            storyText.style.color = '#e74c3c';
        } else {
            storyText.style.color = '#27ae60';
        }
    }
}

function updateHealthBar() {
    const healthBar = document.getElementById('healthBar');
    const healthText = document.getElementById('health');
    const percentage = playerHealth;
    
    healthBar.style.width = percentage + '%';
    healthText.textContent = playerHealth;
    
    if (playerHealth <= 25) {
        healthBar.classList.add('danger');
    } else {
        healthBar.classList.remove('danger');
    }
}

document.getElementById('resetGame').addEventListener('click', () => {
    currentSceneId = 'start';
    playerHealth = 100;
    gameActive = true;
    updateHealthBar();
    displayScene(currentSceneId);
});

// Save and Load functionality
function saveGame() {
    const gameState = {
        currentSceneId: currentSceneId,
        playerHealth: playerHealth,
        gameActive: gameActive,
        timestamp: new Date().toLocaleString()
    };
    
    try {
        localStorage.setItem('percyJacksonGameSave', JSON.stringify(gameState));
        showNotification('✅ Game saved successfully!', 'show');
    } catch (error) {
        showNotification('❌ Failed to save game', 'error');
    }
}

function loadGame() {
    try {
        const savedState = localStorage.getItem('percyJacksonGameSave');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            currentSceneId = gameState.currentSceneId;
            playerHealth = gameState.playerHealth;
            gameActive = gameState.gameActive;
            updateHealthBar();
            displayScene(currentSceneId);
            showNotification(`✅ Game loaded! (Saved: ${gameState.timestamp})`, 'show');
        } else {
            showNotification('❌ No save file found', 'error');
        }
    } catch (error) {
        showNotification('❌ Failed to load game', 'error');
    }
}

function showNotification(message, className) {
    const notification = document.getElementById('saveNotification');
    notification.textContent = message;
    notification.className = `save-notification ${className}`;
    
    setTimeout(() => {
        notification.className = 'save-notification';
    }, 3000);
}

document.getElementById('saveGame').addEventListener('click', saveGame);
document.getElementById('loadGame').addEventListener('click', loadGame);

// Start the game
displayScene(currentSceneId);
updateHealthBar();