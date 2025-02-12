import { Application, Assets, Graphics, Sprite, Container, Text, BlurFilter } from "pixi.js";
import { mapLose, mapWin, positionMap } from './map';
import { Tween, Group } from '@tweenjs/tween.js';
import { backMusic, wellMusic, finalMusic, placeMusic, cupcakeImg, figureImg_1, figureImg_2, figureImg_3, figureImg_4, figureImg_5, figureImg_6, bgImg, cursorImg, errorImg, buttonImg, finalBgImg, finalItemImg_1, finalItemImg_2, finalItemImg_3, finalItemImg_4 } from './assets';

if (mraid.getState() === 'loading') {
  mraid.addEventListener('ready', showMyAd);
} else {
  showMyAd();
}

async function showMyAd() {

  const app = new Application({
    width: 640, height: 360, autoDensity: true,
    resolution: window.devicePixelRatio ?? 1, resizeTo: window
  });
  document.getElementById("pixi-container").appendChild(app.view);

  await Assets.load([
    {
      alias: 'cupcake',
      src: cupcakeImg
    },
    {
      alias: 'figure_1',
      src: figureImg_1,
    },
    {
      alias: 'figure_2',
      src: figureImg_2
    },
    {
      alias: 'figure_3',
      src: figureImg_3
    },
    {
      alias: 'figure_4',
      src: figureImg_4
    },
    {
      alias: 'figure_5',
      src: figureImg_5
    },
    {
      alias: 'figure_6',
      src: figureImg_6
    },
    {
      alias: 'bg',
      src: bgImg
    },
    {
      alias: 'cursor',
      src: cursorImg
    },
    {
      alias: 'errorImage',
      src: errorImg
    },
    {
      alias: 'button',
      src: buttonImg
    },
    {
      alias: 'final-bg',
      src: finalBgImg
    },
    {
      alias: 'finalItem_1',
      src: finalItemImg_1
    },
    {
      alias: 'finalItem_2',
      src: finalItemImg_2
    },
    {
      alias: 'finalItem_3',
      src: finalItemImg_3
    },
    {
      alias: 'finalItem_4',
      src: finalItemImg_4
    },

  ])

  const screenWidth = app.screen.width;
  const screenHeight = app.screen.height;
  const blurFilter = new BlurFilter();
  const background = Sprite.from('bg')
  const cursor = Sprite.from('cursor')
  const errorImage = Sprite.from('errorImage')
  const finalBg = Sprite.from('final-bg')
  const button = Sprite.from('button')
  cursor.zIndex = 3
  cursor.width = 160
  cursor.height = 160
  background.width = screenWidth
  background.height = screenHeight

  app.stage.addChild(background)
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEnd);
  app.stage.on('pointerupoutside', onDragEnd);

  const group = new Group();
  let dragTarget
  let tween
  let count
  let isWinLap = false
  const mapState = (lap) => lap ? mapWin : mapLose
  const figureLenght = positionMap.length - 1;
  const shapeContainer = new Container();
  const figureContainer = new Container();

  const showError = () => {
    errorImage.width = screenWidth
    errorImage.height = screenWidth
    errorImage.scale.set(1)
    errorImage.anchor.set(0.5)
    errorImage.zIndex = -5
    const scaleArray = [1.2, 1, 1.2, 1]
    new Tween(errorImage, group).to({ scale: { x: scaleArray, y: scaleArray } }).start();
    shapeContainer.addChild(errorImage)
    setTimeout(() => {
      shapeContainer.removeChild(errorImage)
    }, 1000)
  }

  const cursorAnimation = (from, to) => {
    shapeContainer.addChild(cursor);
    cursor.position = from
    tween = new Tween(cursor).to(to, 1500).start().repeat(Infinity)
    animate()
  }

  function animate(time) {
    requestAnimationFrame(animate)
    tween?.update()
    group.update(time)
  }

  const shapeAnimation = () => {
    figureContainer.children.map((item, idx) => {
      new Tween(item, group).to(positionMap[idx], 500).delay(300).start()
      item.eventMode = 'static'
    })
    animate()
  }

  const shape = (app, map) => {
    map.map((item, idx) => {
      const figure = Sprite.from(`figure_${idx + 1}`)
      figure.cursor = 'pointer'
      figure.eventMode = 'static'
      figure.anchor.set(0.5)
      figure.scale.set(1)
      figure.index = idx
      figure.position = item
      figure.on('pointerdown', onDragStart, figure)
      figureContainer.addChild(figure)
    })
    const cupcake = Sprite.from('cupcake');
    cupcake.anchor.set(0.5)
    cupcake.zIndex = -1
    shapeContainer.addChild(cupcake)
    shapeContainer.addChild(figureContainer)
    shapeContainer.width = screenWidth
    shapeContainer.height = screenWidth
    shapeContainer.position.x = (screenWidth - shapeContainer.width) / 2 + (shapeContainer.width / 2);
    shapeContainer.position.y = (screenHeight - shapeContainer.height) / 2 + (shapeContainer.height / 2)
    shapeContainer.sortableChildren = true
    app.stage.addChild(shapeContainer)
    cursorAnimation(positionMap[figureLenght], mapState(isWinLap)[figureLenght])
  }

  const popup = (app, text) => {
    const popupContainer = new Container();
    const popupText = new Text(text, {
      fontFamily: 'semi',
      fontSize: 20,
      fill: 0xffffff,
      align: 'center'
    });

    const popupBackground = new Graphics().beginFill('0x4da3a6').drawRoundedRect(0, 0, popupText.width + 40, popupText.height + 20, 50).endFill()

    popupText.x = popupBackground.width / 2
    popupText.y = popupBackground.height / 2
    popupText.anchor.x = 0.5
    popupText.anchor.y = 0.5

    popupContainer.x = (screenWidth - popupBackground.width) / 2
    popupContainer.y = 40

    popupContainer.addChild(popupBackground, popupText)
    app.stage.addChild(popupContainer);
  }

  const popupMessage = (text, eventOnEnding, withoutTimeOut) => {
    const container = new Container();
    const message = new Text(text, {
      fontFamily: 'semi',
      fontSize: 20,
      fill: 0xffffff,
      align: 'center'
    });

    const popupBackground = new Graphics().beginFill('0x4da3a6').drawRoundedRect(0, 0, message.width + 40, message.height + 20, 50).endFill()

    message.x = popupBackground.width / 2
    message.y = popupBackground.height / 2
    message.anchor.x = 0.5
    message.anchor.y = 0.5

    container.x = (screenWidth - popupBackground.width) / 2
    container.y = (screenHeight - popupBackground.height) / 2
    container.scale.set(0.1)
    container.addChild(popupBackground, message)
    app.stage.addChild(container)
    new Tween(container, group).to({ scale: { x: [1.2, 1, 1, 0.0], y: [1.2, 1, 1, 0.0] } }, 1500).start()
    withoutTimeOut()
    setTimeout(() => eventOnEnding(), 1500)

  }

  popup(app, 'Fill up the cupcake for IQ 120+')
  shape(app, positionMap)


  function onDragMove(event) {
    if (dragTarget) {
      dragTarget.parent.toLocal(event.global, null, dragTarget.position);
      dragTarget.zIndex = 2
    }
  }


  function onDragStart() {
    if (count === this.index || figureLenght === this.index) {
      tween.stop()
      shapeContainer.removeChild(cursor);
      count = this.index
      this.alpha = 0.5;
      dragTarget = this;
      app.stage.on('pointermove', onDragMove);
      if (!backMusic.playing()) {
        backMusic.play()
      }
    }
  }

  function onDragEnd() {
    if (dragTarget) {
      app.stage.off('pointermove', onDragMove);
      dragTarget.alpha = 1;
      if (detectIntersect(dragTarget, mapState(isWinLap)[dragTarget.index])) {
        placeMusic.play()
        if (count) {
          count -= 1
          cursorAnimation(positionMap[count], mapState(isWinLap)[count])
          dragTarget.position = mapState(isWinLap)[dragTarget.index]
          dragTarget.eventMode = 'none';
          dragTarget.zIndex = 1
        } else {
          if (isWinLap) {
            dragTarget.position = mapState(isWinLap)[dragTarget.index]
            dragTarget.eventMode = 'none';
            wellMusic.play()
            popupMessage('Well done', finalScene, () => null)
          } else {
            popupMessage('Try again', endingErrorFunction, showError)
            isWinLap = true
          }
        }
      }
      dragTarget = null;
    }
    function detectIntersect(piece, point) {
      let gap = 50
      let bounds = piece.position;
      if (!Boolean(count) && !isWinLap) return true
      return bounds.x + piece.width > point.x &&
        bounds.x < point.x + gap &&
        bounds.y + piece.height > point.y &&
        bounds.y < point.y + gap
    }
  }
  function endingErrorFunction() {
    shapeAnimation()
    cursorAnimation(positionMap[figureLenght], mapState(isWinLap)[figureLenght])
  }

  function finalScene() {
    const link = 'http://play.google.com/store/apps/details?id=games.burny.playdoku.block.puzzle&hl=en&gl=US&pli=1'
    const finalContainer = new Container();
    const buttonTitle = new Text('PLAYDOKU', {
      fontFamily: 'black',
      fontSize: 30,
      fill: 0xffffff,
      align: 'center'
    })
    const buttonText = new Text('Play now', {
      fontFamily: 'semi',
      fontSize: 20,
      fill: 594909,
      align: 'center'
    })
    finalBg.width = screenWidth
    finalBg.height = screenHeight
    finalContainer.addChild(finalBg)


    button.scale.set(0.3)
    button.anchor.set(0.5)
    button.eventMode = 'static'
    button.cursor = 'pointer'
    button.on('pointerdown', () => mraid.open(link))
    buttonText.cursor = 'pointer'
    buttonText.eventMode = 'static'
    buttonText.on('pointerdown', () => mraid.open(link))
    button.position = { x: (screenWidth / 2 - button.width / 2) + button.width / 2, y: (screenHeight / 2 - button.height) + button.height / 2 + 60 }
    new Tween(button, group).to({ scale: { x: [0.3, 0.31, 0.3, 0.32], y: [0.3, 0.31, 0.3, 0.32] } }, 500).delay(500).start()

    buttonText.position = { x: (screenWidth / 2 - buttonText.width / 2), y: (screenHeight / 2 - buttonText.height - 30) + 60 }

    buttonTitle.anchor.set(0.5)
    buttonTitle.position = { x: (screenWidth / 2 - buttonTitle.width / 2) + buttonTitle.width / 2, y: (screenHeight / 2 - buttonTitle.height * 2) }
    new Tween(buttonTitle, group).to({ scale: { x: [1, 1.1, 1, 1.1], y: [1, 1.1, 1, 1.1] } }, 500).delay(500).start()

    finalContainer.addChild(button, buttonText, buttonTitle)


    const positions = [{ start: { x: -50, y: -50 }, stop: { x: -10, y: -30 } },
    { start: { x: screenWidth - 150, y: -60 }, stop: { x: screenWidth - 150, y: -20 } },
    {
      start: { x: -100, y: screenHeight - 200 }, stop: {
        x: -20, y: screenHeight - 200
      }
    },
    { start: { x: screenWidth, y: screenHeight - 80 }, stop: { x: screenWidth - 80, y: screenHeight - 80 } }]

    Array(4).fill(0).map((_, idx) => {
      const finalItem = Sprite.from(`finalItem_${idx + 1}`)
      finalItem.filters = [blurFilter]
      blurFilter.blur = 2
      finalItem.position = positions[idx].start
      finalItem.scale.set(0.3)
      new Tween(finalItem, group).to(positions[idx].stop, 500).start()
      new Tween(finalItem, group).to({ scale: { x: [0.3, 0.35, 0.32, 0.25], y: [0.3, 0.35, 0.32, 0.25] } }, 500).delay(idx * 100 + 500).start()
      finalContainer.addChild(finalItem)
    })
    finalMusic.play()
    backMusic.stop()
    app.stage.addChild(finalContainer)
  }

};
