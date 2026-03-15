

export async function sortieSurchauffe(event, message, target)
{
    const actor =  await fromUuid(message.rolls[0].options.actor);
    
    actor.update({"system.magie.isSurchauffe": false});
    
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ alias: actor.name }),
        content: game.i18n.format("beryllium.messages.surchauffe.sortie", {actor: actor.name}),
    });

}