
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
    //console.log(event, message, target)
    //console.log(message.rolls[0], message.rolls[0].options.actor)
    const actor =  await fromUuid(message.rolls[0].options.actor);
    
    actor.update({"system.magie.isSurchauffe": false});
    
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: actor.name }),
        content: game.i18n.format("beryllium.messages.surchauffe.sortie", {actor: actor.name}),
    });

}