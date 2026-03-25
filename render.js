function renderSymmetricNode(ctx, x, y, pattern) {
    const seq = DBM.sequence(pattern);
    
    // Draw Left (Symmetrical Part)
    ctx.fillText(seq.left, x - 50, y);
    
    // Draw Equilibrium (The "Center" Balance)
    ctx.fillStyle = "cyan";
    ctx.fillText(seq.equilibrium, x, y);
    
    // Draw Right (The Buddy System Mirror)
    ctx.fillStyle = "white";
    ctx.fillText(seq.right, x + 50, y);
}
