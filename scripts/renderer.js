class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        this.ball_tx = null;
        this.ball_ty = null;

        this.ball_v_x = 250;
        this.ball_v_y = 250;

        this.ball_center = {x: 200, y: 200};
        this.ball_radius = 40;

        this.ball_points = [
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(0), this.ball_center.y + this.ball_radius * Math.sin(0), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 12), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 6), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 6), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 4), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 4), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 3), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 3), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(5 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(5 * Math.PI / 12), 1),

            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI / 2), this.ball_center.y + this.ball_radius * Math.sin(Math.PI / 2), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(7 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(7 * Math.PI / 12), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(2 * Math.PI / 3), this.ball_center.y + this.ball_radius * Math.sin(2 * Math.PI / 3), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(3 * Math.PI / 4), this.ball_center.y + this.ball_radius * Math.sin(3 * Math.PI / 4), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(5 * Math.PI / 6), this.ball_center.y + this.ball_radius * Math.sin(5 * Math.PI / 6), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(11 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(11 * Math.PI / 12), 1),

            Vector3(this.ball_center.x + this.ball_radius * Math.cos(Math.PI), this.ball_center.y + this.ball_radius * Math.sin(Math.PI), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(13 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(13 * Math.PI / 12), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(7 * Math.PI / 6), this.ball_center.y + this.ball_radius * Math.sin(7 * Math.PI / 6), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(5 * Math.PI / 4), this.ball_center.y + this.ball_radius * Math.sin(5 * Math.PI / 4), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(4 * Math.PI / 3), this.ball_center.y + this.ball_radius * Math.sin(4 * Math.PI / 3), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(17 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(17 * Math.PI / 12), 1),

            Vector3(this.ball_center.x + this.ball_radius * Math.cos(3 * Math.PI / 2), this.ball_center.y + this.ball_radius * Math.sin(3 * Math.PI / 2), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(19 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(19 * Math.PI / 12), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(5 * Math.PI / 3), this.ball_center.y + this.ball_radius * Math.sin(5 * Math.PI / 3), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(7 * Math.PI / 4), this.ball_center.y + this.ball_radius * Math.sin(7 * Math.PI / 4), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(11 * Math.PI / 6), this.ball_center.y + this.ball_radius * Math.sin(11 * Math.PI / 6), 1),
            Vector3(this.ball_center.x + this.ball_radius * Math.cos(23 * Math.PI / 12), this.ball_center.y + this.ball_radius * Math.sin(23 * Math.PI / 12), 1),
        ];

        this.poly0_r = null;
        this.poly1_r = null;
        this.poly2_r = null;

        this.poly1_s = null;
        this.poly2_s = null;

    }


    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
        
        this.ball_tx = this.ball_v_x *((delta_time)/1000.0);
        this.ball_ty = this.ball_v_y *((delta_time)/1000.0);


        this.poly0_r = this.poly0_r *(time + delta_time);
        this.poly1_r = this.poly1_r *(time + delta_time);
        this.poly2_r = this.poly2_r *(time + delta_time);

        this.poly1_s = this.poly1_s *(time + delta_time);
        this.poly2_s = this.poly2_s *(time + delta_time);
        
    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        
        // Following line is example of drawing a single polygon
        // (this should be removed/edited after you implement the slide)
        /* let diamond = [
            Vector3(400, 150, 1),
            Vector3(500, 300, 1),
            Vector3(400, 450, 1),
            Vector3(300, 300, 1)
        ];
        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(diamond, teal); */

        for(let i = 0; i < this.ball_points.length; i++){
           this.ball_points[i] = Vector3((this.ball_points[i].values[0][0] + this.ball_tx), (this.ball_points[i].values[1][0] + this.ball_ty), 1);
        }

        // hits edge left/right - reverse velocity in x
        if(this.ball_points[0].values[0][0] >= this.canvas.width || this.ball_points[12].values[0][0] <= 0) {
                this.ball_v_x = -1 * this.ball_v_x;
        }
        // hits edge top/bottom - reverse velocity in y
        if(this.ball_points[6].values[1][0] >= this.canvas.height || this.ball_points[18].values[1][0] <= 0) {
            this.ball_v_y = -1 * this.ball_v_y;
        }

        this.drawConvexPolygon(this.ball_points, [123, 66, 245, 255]);
        
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions


    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};
