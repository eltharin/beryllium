


export class EchoMjApplication extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  scene = null;
  value = 0;
  max = 0;
  document = null;

  static PARTS = {
    template: { 
      template: "systems/beryllium/templates/echoMj.hbs"
    },
  };

  
  constructor(scene, options = {}) {
    super(options);

    let sceneData = scene.getFlag("beryllium", "echoMj");
    let userData  = game.user.getFlag("beryllium", "echoMj");
    
    this.scene = scene;
    this.value = sceneData?.value || 0;
    
    if(!game.echoMj) {game.echoMj = {}}
    
    game.echoMj[scene.id] = this;


    
    let renderOptions = {force: true};
    if(userData?.position) {
        renderOptions.position = userData.position;
        renderOptions.position.width = 230;
        renderOptions.position.height = 150;
    }

    this.render(renderOptions);

  }

  static DEFAULT_OPTIONS = {
    tag: 'div',
    id: "echoMj",
    popout: false,
    actions: {
        removeEcho: this._onRemoveEcho,
        addEcho: this._onAddEcho,
    },
    position: {
      width: 230,
      height: 150,
      left: 10,
      top:0,
    },
    classes: ["sheet", "beryllium"],
    window: {
      resizable: false,
      controls: [
      ]
    },
  }

  static _onRemoveEcho(event,target) {
    game.echoMj[target.closest('.echo_mj').dataset.scene].incValue(-1);
  }

  static _onAddEcho(event,target) {
    game.echoMj[target.closest('.echo_mj').dataset.scene].incValue(1);
  }

  incValue(inc) {
    this.value += inc;
    this.saveData();
    this.render(true);
  }

  _onPosition(position) {
    this.saveData();    
  }

  saveData() {
    let sceneData = {
        value : this.value,
        max : this.max
    };

    let userData = {
        position: this.position,
    };

    this.scene.setFlag("beryllium", "echoMj", sceneData);
    game.user.setFlag("beryllium", "echoMj", userData);
  }

  async close(options = {}) {
    return; //interdiction de fermer la fenetre
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.value = this.value;
    context.max = this.max;
    context.scene = this.scene.id;
    return context;
  }

  updateRender(echoMj) {
    let render = false;
    if(echoMj.value) {
      this.value = echoMj.value;
      render = true;
    }
    
    if(render) {
      this.render(true);
    }
  }
}