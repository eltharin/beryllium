
export class Surchauffe {
    static enterSurchauffe(actor) {
        actor.update({"system.magie.isSurchauffe": true});

        ChatMessage.create({
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ alias: actor.name }),
          content: game.i18n.format("beryllium.messages.surchauffe.entree", {actor: actor.name}),
        });
    }
}