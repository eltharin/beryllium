
export async function enterSurchauffe(actor) {
    actor.update({"system.magie.isSurchauffe": true});

    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: actor.name }),
        content: game.i18n.format("beryllium.messages.surchauffe.entree", {actor: actor.name}),
    });
}

export async function sortieSurchauffe(event, message, target)
{
    const actor =  await fromUuid(message.rolls[0].options.actor.uuid);
    
    actor.update({"system.magie.isSurchauffe": false});
    
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: actor.name }),
        content: game.i18n.format("beryllium.messages.surchauffe.sortie", {actor: actor.name}),
    });

}

export async function gainFragment(event, message, target)
{
    const actor =  await fromUuid(message.rolls[0].options.actor.uuid);
    
    //actor.update({"system.magie.isSurchauffe": false});
    
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: actor.name }),
        content: game.i18n.format("beryllium.messages.oubli.gain", {actor: actor.name}),
    });

}

export async function perteOubli(event, message, target)
{
    const actor =  await fromUuid(message.rolls[0].options.actor.uuid);
    actor.update({"system.oubli.value": actor.system.oubli.value - event.target.dataset.nbpoint});
    
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: actor.name }),
        content: game.i18n.format("beryllium.messages.oubli.perte", {actor: actor.name, nbPoint: event.target.dataset.nbpoint}),
    });

}

