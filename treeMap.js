window.addEventListener('load', () => {
	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');

	const treeFiles = [
		'Assets/Objects/Trees/Autumn_tree1.png',
		'Assets/Objects/Trees/Fruit_tree1.png',
		'Assets/Objects/Trees/Palm_tree1_1.png',
		'Assets/Objects/Trees/Flower_tree1.png',
		'Assets/Objects/Trees/Tree1.png'
	];

	let trees = [], loaded = 0;

	function loadTrees() {
		treeFiles.forEach((src, index) => {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				console.log('Loaded tree:', src);
				trees.push({
					image: img,
					x: 50 + index * 140,
					y: 100 + (index % 2) * 80,
					hitCount: 0,
					chopAnimationTimer: 0
				});
				loaded++;
				if (loaded === treeFiles.length) {
					window.trees = trees;
				}
			};
			img.onerror = () => {
				console.error('Error loading tree image:', src);
				loaded++;
				if (loaded === treeFiles.length) {
					window.trees = trees;
				}
			};
		});
	}
	loadTrees();

	window.drawStaticTrees = function(ctx) {
		if (!window.trees) return;
		window.trees.forEach(tree => {
			ctx.drawImage(tree.image, tree.x, tree.y);
			if (tree.chopAnimationTimer > 0) {
				ctx.fillStyle = "rgba(255,0,0,0.5)";
				const cx = tree.x + tree.image.width / 2;
				const cy = tree.y + tree.image.height / 2;
				ctx.beginPath();
				ctx.arc(cx, cy, 20, 0, Math.PI * 2);
				ctx.fill();
			}
		});
	};
});
