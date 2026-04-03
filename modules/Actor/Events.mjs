class ActorUpdates
{
    static getChangedValue(actor, changes, property)
    {
        if(! foundry.utils.hasProperty(changes, property) ) return null;
        const oldValue = foundry.utils.getProperty(changes, "flags.beryllium.updateedValues." + property);
        const newValue = foundry.utils.getProperty(actor, property);

        if(oldValue == newValue) return null;

        return {
            old: oldValue,
            new: newValue,
            delta: newValue-oldValue,
            result: ((newValue-oldValue) > 0 ? "+" : "" ) + (newValue-oldValue),
        }
    }

    static printChange(token, message, color)
    {
      let position = token.center;
      position.y -= 50;
      // Affichage du texte flottant
      canvas.interface.createScrollingText(position, message, {
        anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
        direction: CONST.TEXT_ANCHOR_POINTS.TOP,
        distance: 100,
        duration: 3000,
        fill: color,
        textStyle: {
          stroke: 0x000000,
          strokeThickness: 4,
          fontSize: 32
        }
      });
    }

    static onStress(actor, changes, options, userId)
    {
        const values = this.getChangedValue(actor, changes, "system.stress.value");
        if(values != null) {
            this.printChange(actor.getActiveTokens()[0], `stress : ${values.result}`, values.delta > 0 ? 0xff0000 : 0x00ff00);
        }
    }

    static onFletrine(actor, changes, options, userId)
    {
        const values = this.getChangedValue(actor, changes, "system.magie.fletrine.value");
        if(values != null) {
            this.printChange(actor.getActiveTokens()[0], `fletrine : ${values.result}`, values.delta > 0 ? 0xff0000 : 0x00ff00);
        }
    }

    static onOubli(actor, changes, options, userId)
    {
        const values = this.getChangedValue(actor, changes, "system.oubli.value");
        if(values != null) {
            this.printChange(actor.getActiveTokens()[0], `oubli : ${values.result}`, values.delta > 0 ? 0x00ff00 : 0xff0000);
        }
    }

    static onEcho(actor, changes, options, userId)
    {
        const values = this.getChangedValue(actor, changes, "system.echo.value");
        if(values != null) {
            this.printChange(actor.getActiveTokens()[0], `echo : ${values.result}`, values.delta > 0 ? 0x00ff00 : 0xff0000);
        }
    }
}

export function register()
{
    Hooks.on("preUpdateActor", (actor, changes, options, userId) => {
        let flags = {};
        Object.entries(foundry.utils.flattenObject(changes)).forEach(([k,v]) => {foundry.utils.setProperty(flags,k,foundry.utils.getProperty(actor, k));});
        foundry.utils.setProperty(changes, "flags.beryllium.updateedValues", flags);
    });

    Hooks.on("updateActor", (actor, changes, options, userId) => {
        ActorUpdates.onStress(actor, changes, options, userId);
        ActorUpdates.onFletrine(actor, changes, options, userId);
        ActorUpdates.onOubli(actor, changes, options, userId);
        ActorUpdates.onEcho(actor, changes, options, userId);

      
/*
      
      // Trouver le token actif sur la scène
      const token = actor.getActiveTokens()[0];
      if (!token) return;

      // Calcul du delta
      const delta = newHP - oldHP;
      //if (!delta == 0) return;

      const sign = delta > 0 ? "+" : "-";

      */
    });
}